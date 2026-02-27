/**
 * MIT License
 *
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { decodeJwt } from "jose";
import { Router } from "./router";
import { getManagementToken, addPermissionsToUser } from "../auth0";

export const setupRoutes = (router: Router, env: Env) => {
	/**
	 * GET /
	 *
	 * Root endpoint providing a simple greeting.
	 * Maintained for backwards compatibility.
	 *
	 * @returns {Promise<Response>} A "Hello World!" text response.
	 */
	router.get("/", async () => {
		return new Response("Hello World!", {
			status: 200,
			headers: { "Content-Type": "text/plain" },
		});
	});

	/**
	 * GET /health
	 *
	 * Simple health check endpoint to verify worker availability.
	 * This endpoint is public and does not require authentication.
	 *
	 * @returns {Promise<Response>} A JSON response indicating success.
	 */
	router.get("/health", async () => {
		return new Response(JSON.stringify({ success: true, status: "ok" }), {
			status: 200,
			headers: { ...router.corsHeaders, "Content-Type": "application/json" },
		});
	});
	/**
	 * POST /api/__auth0/token
	 *
	 * Requests an Auth0 Management API token via the client_credentials flow.
	 * The token is cached in KV store to optimize performance and respect Auth0 rate limits.
	 *
	 * @requires env.ADMIN_AUTH0_PERMISSION (auth0:admin:api)
	 * @returns {Promise<Response>} A JSON response containing the access token and expiration details.
	 */
	router.post(
		"/api/__auth0/token",
		async () => {
			try {
				const token = await getManagementToken(env);
				// We don't have the full response here anymore, but we can return the token.
				// For backwards compatibility with the UI expecting specific fields:
				let exp: number | undefined;
				try {
					const decoded = decodeJwt(token);
					exp = (decoded?.exp as number) || undefined;
				} catch (_) { }

				const now = Math.floor(Date.now() / 1000);

				return new Response(
					JSON.stringify({
						access_token: token,
						token_type: "Bearer",
						expires_in: exp ? exp - now : 3600,
						from_cache: true, // we assume it might be from cache
					}),
					{
						status: 200,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					},
				);
			} catch (error) {
				return new Response(
					JSON.stringify({ success: false, error: String(error) }),
					{
						status: 500,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					},
				);
			}
		},
		env.ADMIN_AUTH0_PERMISSION,
	);

	/**
	 * POST /api/__auth0/autopermissions
	 *
	 * Automatically assigns default permissions to the authenticated user if they are missing.
	 * The permissions to be assigned are defined in `env.AUTH0_AUTOMATIC_PERMISSIONS`.
	 *
	 * @requires A valid JWT (authentication required, but no specific scope needed).
	 * @returns {Promise<Response>} A JSON response indicating successfully added permissions or status.
	 */
	router.post(
		"/api/__auth0/autopermissions",
		async (request) => {
			try {
				const autoPermsStr = env.AUTH0_AUTOMATIC_PERMISSIONS || "";
				if (!autoPermsStr) {
					return new Response(JSON.stringify({ success: true, message: "No automatic permissions configured" }), {
						status: 200,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					});
				}

				const autoPerms = autoPermsStr.split(",").map(p => p.trim()).filter(p => p !== "");
				const currentPerms = router.userPermissions || [];
				const missingPerms = autoPerms.filter(p => !currentPerms.includes(p));

				if (missingPerms.length === 0) {
					return new Response(JSON.stringify({ success: true, message: "User already has all automatic permissions" }), {
						status: 200,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					});
				}

				const userId = router.jwtPayload.sub;
				if (!userId) {
					throw new Error("User ID not found in token");
				}

				await addPermissionsToUser(userId, missingPerms, env);

				return new Response(JSON.stringify({ success: true, added: missingPerms }), {
					status: 200,
					headers: { ...router.corsHeaders, "Content-Type": "application/json" },
				});
			} catch (error) {
				return new Response(
					JSON.stringify({ success: false, error: String(error) }),
					{
						status: 500,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					},
				);
			}
		},
		/**
		 * Empty string indicator: This route requires a valid JWT (authentication)
		 * but does not require any specific scope/permission to access.
		 * This triggers 'jwtPayload.sub' extraction in the router.
		 */
		"",
	);
	/**
	 * GET /api/ping
	 *
	 * A protected test endpoint to verify authentication and basic connectivity.
	 *
	 * @requires env.READ_PERMISSION
	 * @returns {Promise<Response>} A JSON response containing the user's sub claim.
	 */
	router.get(
		"/api/ping",
		async (_request) => {
			return new Response(
				JSON.stringify({ success: true, user: router.jwtPayload.sub || null }),
				{
					status: 200,
					headers: {
						...router.corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		},
		env.READ_PERMISSION,
	);

	/**
	 * GET /api/get_users
	 *
	 * Retrieves the current authenticated user's ID.
	 *
	 * @requires env.READ_PERMISSION
	 * @returns {Promise<Response>} A JSON response with the user's sub ID.
	 */
	router.get(
		"/api/get_users",
		async (_request) => {
			const user = router.jwtPayload.sub || ""; // Attach the JWT payload to the request for use in the handler

			return new Response(JSON.stringify({ success: true, user }), {
				status: 200,
				headers: { ...router.corsHeaders, "Content-Type": "application/json" },
			});
		},
		env.READ_PERMISSION,
	);

	/**
	 * GET /api/get/<user>
	 *
	 * A debug endpoint that returns comprehensive information about the request,
	 * including URL parameters, user ID, permissions, and the raw JWT.
	 *
	 * @param {string} user - Dynamic user parameter from the URL.
	 * @requires env.READ_PERMISSION
	 * @returns {Promise<Response>} A JSON response with session and request details.
	 */
	router.get(
		"/api/get/<user>",
		async (request) => {
			const { user } = request.params; // Extract the dynamic parameter from the URL
			const sub = router.jwtPayload.sub || ""; // Attach the JWT payload to the request for use in the handler
			const permissions = router.userPermissions; // Get the permissions from the JWT payload
			const token =
				request.headers.get("Authorization")?.replace("Bearer ", "") || "";

			return new Response(
				JSON.stringify({ success: true, user, sub, permissions, token }),
				{
					status: 200,
					headers: {
						...router.corsHeaders,
						"Content-Type": "application/json",
					},
				},
			);
		},
		env.READ_PERMISSION,
	);
};
