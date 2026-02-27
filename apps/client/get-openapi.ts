/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import fs from "fs";
import swaggerJsdoc from "swagger-jsdoc";

export const API_VERSION = "1.0.0";

const options = {
    encoding: "utf8",
    failOnErrors: false,
    format: "json",
    info: {
        title: "KduFoot API",
        version: API_VERSION,
    },
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KduFoot API",
            version: API_VERSION,
        },
    },
    apis: [
        "../cloudflare-worker/src/routes/index.ts",
        "../cloudflare-worker/src/routes/clubs.ts",
        "../cloudflare-worker/src/routes/exercises.ts",
        "../cloudflare-worker/src/routes/matches.ts",
        "../cloudflare-worker/src/routes/sessions.ts",
        "../cloudflare-worker/src/routes/users.ts",
    ],
};

const openApi = await swaggerJsdoc(options) as any;

openApi.components.securitySchemes = {
    bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    },
};
openApi.security = [
    {
        bearerAuth: [],
    },
];

// Write the OpenAPI spec to a file public/openapi.json
fs.writeFileSync(
    "./public/openapi.json",
    JSON.stringify(openApi, null, 2),
    "utf8",
);
