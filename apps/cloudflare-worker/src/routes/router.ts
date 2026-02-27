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

/* global URLPattern */
import { JWTPayload } from "jose";

import { checkPermissions } from "../auth0";

/**
 * Type definition for a route handler function.
 *
 * @callback RouteHandler
 * @param {Request & { params: Record<string, string>; user?: any }} request - The extended Fetch Request object.
 * @param {Env} env - The Cloudflare Worker environment variables and bindings.
 * @returns {Promise<Response>} A promise that resolves to a Fetch Response.
 */
type RouteHandler = (
	request: Request & { params: Record<string, string>; user?: any },
	env: Env,
) => Promise<Response>;

/**
 * Interface representing a registered route.
 *
 * @interface Route
 * @property {string} path - The URL path pattern.
 * @property {string} method - The HTTP method (GET, POST, etc.).
 * @property {RouteHandler} handler - The function to handle the request.
 * @property {string} [permission] - Optional permission required to access the route.
 * @property {URLPattern | null} [compiled] - Pre-compiled URLPattern for efficient matching.
 */
interface Route {
	path: string;
	method: string;
	handler: RouteHandler;
	permission?: string;
	// Compiled URLPattern for advanced matching (Rocket-style <> syntax)
	compiled?: URLPattern | null;
}

/**
 * A simple router for Cloudflare Workers supporting middleware-like permission checks,
 * Rocket-style path parameters, and CORS.
 */
export class Router {
	jwtPayload: JWTPayload = {};
	userPermissions: string[] = [];
	routes: Route[] = [];
	corsHeaders: Record<string, string>;

	constructor(env: Env) {
		this.corsHeaders = {
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Origin": env.CORS_ORIGIN,
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Content-Type": "application/json",
		};
	}

	/**
	 * Registers a GET route.
	 *
	 * @param {string} path - The route path (supports <param> syntax).
	 * @param {RouteHandler} handler - The handler function for this route.
	 * @param {string} [permission] - Optional required permission.
	 */
	get(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "GET",
			handler,
			permission,
		});
	}

	/**
	 * Registers a POST route.
	 *
	 * @param {string} path - The route path.
	 * @param {RouteHandler} handler - The handler function.
	 * @param {string} [permission] - Optional required permission.
	 */
	post(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "POST",
			handler,
			permission,
		});
	}

	/**
	 * Registers a PUT route.
	 *
	 * @param {string} path - The route path.
	 * @param {RouteHandler} handler - The handler function.
	 * @param {string} [permission] - Optional required permission.
	 */
	put(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "PUT",
			handler,
			permission,
		});
	}

	/**
	 * Registers a DELETE route.
	 *
	 * @param {string} path - The route path.
	 * @param {RouteHandler} handler - The handler function.
	 * @param {string} [permission] - Optional required permission.
	 */
	delete(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "DELETE",
			handler,
			permission,
		});
	}

	/**
	 * Compiles a route path into a URLPattern if it contains Rocket-style parameters.
	 * Supported syntax:
	 * - `<name>` -> `:name`
	 * - `<name..>` -> `:name*` (catch-all)
	 *
	 * @param {string} path - The raw route path.
	 * @returns {{ compiled?: URLPattern | null }} An object containing the compiled pattern.
	 * @private
	 */
	private compileRoute(path: string): { compiled?: URLPattern | null } {
		// Quick detection: only compile if the route contains '<' and '>'
		if (!path.includes("<") || !path.includes(">")) return { compiled: null };

		// Convert `<name..>` to `:name*` and `<name>` to `:name`
		// Keep it simple (strings only) per choice
		const converted = path
			.replace(/<([a-zA-Z0-9_]+)\.\.>/g, ":$1*")
			.replace(/<([a-zA-Z0-9_]+)>/g, ":$1");

		try {
			const pattern = new URLPattern({ pathname: converted });

			return { compiled: pattern };
		} catch (e) {
			// If URLPattern is not available or pattern invalid, fallback to null
			// (caller will use the legacy matchPath)
			// eslint-disable-next-line no-console
			console.warn("Failed to compile route pattern:", converted, e);

			return { compiled: null };
		}
	}

	/**
	 * Returns a standard 403 Forbidden response for unauthorized requests.
	 *
	 * @returns {Promise<Response>} A JSON response indicating unauthorized access.
	 */
	async handleUnauthorizedRequest(): Promise<Response> {
		return new Response(
			JSON.stringify({ success: false, error: "Unauthorized" }),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	/**
	 * The main entry point for processing incoming Fetch requests.
	 * Handles CORS, rate limiting, authentication, and route dispatching.
	 *
	 * @param {Request} request - The incoming Fetch request.
	 * @param {Env} env - The Cloudflare Worker environment.
	 * @returns {Promise<Response>} The response from the matched handler or an error response.
	 */
	async handleRequest(request: Request, env: Env): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					...this.corsHeaders,
					"Access-Control-Allow-Credentials": "true",
				},
			});
		}

		const url = new URL(request.url);
		const { pathname } = url;

		// Rate limiting (uses binding RATE_LIMITER if present)
		try {
			const ip = request.headers.get("CF-Connecting-IP") || "unknown";
			const userId = this.jwtPayload.sub || "anonymous";
			const endpoint = pathname;
			const rateLimitKey = `${ip}:${userId}:${endpoint}`;

			if (env.RATE_LIMITER) {
				const { success } = await env.RATE_LIMITER.limit({ key: rateLimitKey });

				if (!success) {
					return new Response(
						JSON.stringify(`429 Failure – rate limit exceeded for ${pathname}`),
						{
							status: 429,
							headers: {
								...this.corsHeaders,
								"X-RateLimit-Limit": "10",
								"X-RateLimit-Remaining": "0",
								"X-RateLimit-Reset": "60",
								"Retry-After": "60",
							},
						},
					);
				}
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error("Rate limiter error:", e);
			// ignore rate limiter errors and continue
		}

		for (const route of this.routes) {
			if (route.method !== request.method) continue;

			let match: Record<string, string> | null = null;

			// If we have a compiled URLPattern, use it (supports Rocket-style <name> syntax)
			if (route.compiled) {
				try {
					const urlObj = new URL(request.url);
					const res = route.compiled.exec(urlObj);

					if (res && res.pathname && res.pathname.groups) {
						// Convert groups (may include undefined entries) to strings
						for (const [k, v] of Object.entries(res.pathname.groups)) {
							if (v !== undefined) {
								(match || (match = {}))[k] = v;
							}
						}
					}
				} catch (e) {
					// eslint-disable-next-line no-console
					console.warn("Error matching URLPattern for route:", route.path, e);
					// ignore URLPattern errors and fallback to legacy matching
				}
			}

			// Fallback to legacy matching if no match from URLPattern
			if (!match) {
				match = this.matchPath(route.path, pathname);
			}

			if (!match) continue;

			// 4. Permission & Authentication Check
			// If route.permission is undefined, the route is public.
			// If route.permission is defined (even as ""), authentication is required.
			if (route.permission !== undefined) {
				if (!request.headers.has("Authorization")) {
					return new Response(
						JSON.stringify({
							success: false,
							error: "Authentication required",
						}),
						{
							status: 401,
							headers: { ...this.corsHeaders },
						},
					);
				}

				const token = request.headers.get("Authorization")?.split(" ")[1];

				if (!token) {
					return new Response(
						JSON.stringify({
							success: false,
							error: "Invalid authorization header",
						}),
						{
							status: 401,
							headers: { ...this.corsHeaders },
						},
					);
				}

				// Verify token identity and permissions.
				// Note: if route.permission is "", this still decodes and validates the sub claim
				// without requiring a specific scope to be present in the token.
				const { access, payload, permissions } = await checkPermissions(
					token,
					route.permission,
					env,
				);

				this.userPermissions = permissions;
				this.jwtPayload = payload;

				if (!access) {
					return new Response(
						JSON.stringify({
							success: false,
							error: "Insufficient permissions",
						}),
						{
							status: 403,
							headers: { ...this.corsHeaders },
						},
					);
				}

				(request as any).user = payload;
			}

			(request as any).params = match;

			try {
				return await route.handler(
					request as Request & { params: Record<string, string>; user?: any },
					env,
				);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Route handler error:", error);

				return new Response(
					JSON.stringify({ success: false, error: "Internal server error" }),
					{
						status: 500,
						headers: { ...this.corsHeaders },
					},
				);
			}
		}

		return new Response(
			JSON.stringify({ success: false, error: "Not found" }),
			{
				status: 404,
				headers: { ...this.corsHeaders },
			},
		);
	}

	/**
	 * Legacy path matching logic for simple ":" prefixed parameters.
	 * Used as a fallback if URLPattern is not used or fails.
	 *
	 * @param {string} routePath - The registered route path.
	 * @param {string} pathname - The actual incoming request path.
	 * @returns {Record<string, string> | null} An object with path parameters or null if no match.
	 * @private
	 */
	private matchPath(
		routePath: string,
		pathname: string,
	): Record<string, string> | null {
		const routeParts = routePath.split("/");
		const pathParts = pathname.split("/");

		if (routeParts.length !== pathParts.length) {
			return null;
		}

		const params: Record<string, string> = {};

		for (let i = 0; i < routeParts.length; i++) {
			const routePart = routeParts[i];
			const pathPart = pathParts[i];

			if (routePart.startsWith(":")) {
				const paramName = routePart.slice(1);

				params[paramName] = pathPart;
				continue;
			}

			if (routePart !== pathPart) {
				return null;
			}
		}

		return params;
	}
}
