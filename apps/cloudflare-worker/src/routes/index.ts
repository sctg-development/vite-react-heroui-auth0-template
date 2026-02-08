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
