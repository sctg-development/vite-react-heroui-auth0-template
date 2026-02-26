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

export const setupRoutes = (router: Router, env: Env) => {
	// Preserve the original root response for backwards compatibility
	router.get("/", async () => {
		return new Response("Hello World!", {
			status: 200,
			headers: { "Content-Type": "text/plain" },
		});
	});

	// Simple health check (public)
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
	 * The token is cached in KV to limit calls to Auth0.
	 * Requires the env.ADMIN_AUTH0_PERMISSION (auth0:admin:api) permission.
	 */
	router.post(
		"/api/__auth0/token",
		async () => {
			try {
				// Check if all necessary environment variables are present
				if (
					!env.AUTH0_MANAGEMENT_API_CLIENT_ID ||
					!env.AUTH0_MANAGEMENT_API_CLIENT_SECRET ||
					!env.AUTH0_DOMAIN
				) {
					const missings = [] as string[]
					if (!env.AUTH0_MANAGEMENT_API_CLIENT_ID) missings.push("AUTH0_MANAGEMENT_API_CLIENT_ID")
					if (!env.AUTH0_MANAGEMENT_API_CLIENT_SECRET) missings.push("AUTH0_MANAGEMENT_API_CLIENT_SECRET")
					if (!env.AUTH0_DOMAIN) missings.push("AUTH0_DOMAIN")

					// Return an error response if configuration is incomplete
					return new Response(
						JSON.stringify({ success: false, error: `Missing Auth0 configuration: ${missings.join(", ")}` }),
						{
							status: 500,
							headers: { ...router.corsHeaders, "Content-Type": "application/json" },
						},
					);
				}

				const tokenUrl = `https://${env.AUTH0_DOMAIN}/oauth/token`;
				const audience = `https://${env.AUTH0_DOMAIN}/api/v2/`;
				const cacheKey = `auth0:management_token`;

				// Check KV cache first
				if (env.KV_CACHE) {
					try {
						const cached = await env.KV_CACHE.get(cacheKey);
						if (cached) {
							let parsed: { token?: string; exp?: number } | null = null;
							try { parsed = JSON.parse(cached); } catch (_) { /* raw token */ }

							const token = parsed?.token ?? cached;
							let exp = parsed?.exp;

							if (!exp && token) {
								try {
									const decoded = decodeJwt(token);
									exp = (decoded?.exp as number) || undefined;
								} catch (_) { exp = undefined; }
							}

							if (exp) {
								const now = Math.floor(Date.now() / 1000);
								if (exp > now + 5) {
									// Cached token still valid -> return it directly
									return new Response(
										JSON.stringify({
											access_token: token,
											token_type: "Bearer",
											expires_in: exp - now,
											from_cache: true,
										}),
										{
											status: 200,
											headers: { ...router.corsHeaders, "Content-Type": "application/json" },
										},
									);
								}
							}
						}
					} catch (e) {
						console.warn("KV_CACHE inaccessible, requesting a new token", String(e));
					}
				}

				// Call Auth0's OAuth service to obtain a new token
				const resp = await fetch(tokenUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						client_id: env.AUTH0_MANAGEMENT_API_CLIENT_ID,
						client_secret: env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
						audience,
						grant_type: "client_credentials",
					}),
				});

				if (!resp.ok) {
					const errorText = await resp.text();
					return new Response(
						JSON.stringify({ success: false, error: `Auth0 failure: ${errorText}` }),
						{
							status: 500,
							headers: { ...router.corsHeaders, "Content-Type": "application/json" },
						},
					);
				}

				const data = (await resp.json()) as {
					access_token?: string;
					token_type?: string;
					expires_in?: number;
					[key: string]: unknown;
				};

				if (!data?.access_token) {
					return new Response(
						JSON.stringify({ success: false, error: "Invalid Auth0 response: no access_token" }),
						{
							status: 500,
							headers: { ...router.corsHeaders, "Content-Type": "application/json" },
						},
					);
				}

				// Cache token in KV
				if (env.KV_CACHE && data.access_token) {
					try {
						const tokenStr = data.access_token as string;
						const now = Math.floor(Date.now() / 1000);
						let exp: number | undefined;

						if (typeof data.expires_in === "number") {
							exp = now + Math.floor(data.expires_in);
						} else {
							try {
								const decoded = decodeJwt(tokenStr);
								exp = (decoded?.exp as number) || undefined;
							} catch (_) { exp = undefined; }
						}

						if (exp && exp > now + 5) {
							await env.KV_CACHE.put(
								cacheKey,
								JSON.stringify({ token: tokenStr, exp }),
								{ expiration: exp },
							);
						}
					} catch (e) {
						console.warn("KV_CACHE cache failure", String(e));
					}
				}

				return new Response(
					JSON.stringify({
						access_token: data.access_token,
						token_type: data.token_type,
						expires_in: data.expires_in,
						from_cache: false,
					}),
					{
						status: 200,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					},
				);
			} catch (error) {
				// Universal error handler for this route
				return new Response(
					JSON.stringify({ success: false, error: String(error) }),
					{
						status: 500,
						headers: { ...router.corsHeaders, "Content-Type": "application/json" },
					},
				);
			}
		},
		env.ADMIN_AUTH0_PERMISSION, // Protect this route with the ADMIN_AUTH0_PERMISSION (auth0:admin:api) permission
	);
	// Protected ping (requires READ permission)
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

	// Protected /api/get_users (requires READ permission)
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

	// Protected /api/get/<user> (requires READ permission)
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
