/**
 * MIT License
 *
 * Copyright (c) 2025 Ronan LE MEILLAT
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
import { checkPermissions } from "./auth0";

const corsHeaders = (env: Env) => {
	return {
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
		"Access-Control-Allow-Origin": env.CORS_ORIGIN,
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	};
};

const fakePayload = {
	message: "Hello World!",
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		const { success } = await env.RATE_LIMITER.limit({ key: pathname });

		if (!success) {
			return new Response(
				JSON.stringify(`429 Failure – rate limit exceeded for ${pathname}`),
				{
					status: 429,
					headers: { contentType: "application/json" },
				},
			);
		}

		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					...corsHeaders(env),
					"Access-Control-Allow-Credentials": "true",
				},
			});
		}
		if (request.headers.has("Authorization")) {
			const token = request.headers.get("Authorization")?.split(" ")[1];

			// Check if the Authorization header is present and has a string at the second index
			if (token) {
				const { access, payload } = await checkPermissions(
					token,
					env.READ_PERMISSION,
					env,
				);

				// Query the API if the user has the required permission
				if (access) {
					const date = new Date();

					return new Response(
						JSON.stringify({
							...fakePayload,
							query: request.url,
							authenticatedUser: payload.sub,
							bearer: token,
							date: date.toISOString(),
						}),
						{
							headers: { ...corsHeaders(env), contentType: "application/json" },
						},
					);
				}
			}
		}

		return new Response(JSON.stringify("403 Failure - Not allowed"), {
			status: 403,
			headers: { ...corsHeaders(env), contentType: "application/json" },
		});
	},
} satisfies ExportedHandler<Env>;
