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

type RouteHandler = (
	request: Request & { params: Record<string, string>; user?: any },
	env: Env,
) => Promise<Response>;

interface Route {
	path: string;
	method: string;
	handler: RouteHandler;
	permission?: string;
	// Compiled URLPattern for advanced matching (Rocket-style <> syntax)
	compiled?: URLPattern | null;
}

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

	get(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "GET",
			handler,
			permission,
		});
	}

	post(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "POST",
			handler,
			permission,
		});
	}

	put(path: string, handler: RouteHandler, permission?: string) {
		this.routes.push({
			...this.compileRoute(path),
			path,
			method: "PUT",
			handler,
			permission,
		});
	}

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
	 * Compile a route path supporting Rocket-style parameters:
	 * - <name> -> :name
	 * - <name..> -> :name* (catch-all)
	 *
	 * Returns an object with an optional URLPattern or null if not necessary.
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

	async handleUnauthorizedRequest(): Promise<Response> {
		return new Response(
			JSON.stringify({ success: false, error: "Unauthorized" }),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

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

			if (route.permission) {
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
