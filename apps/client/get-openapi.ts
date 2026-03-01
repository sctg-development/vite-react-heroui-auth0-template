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
import dotenv from "dotenv";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const env = dotenv.config({
  path: path.resolve(import.meta.dirname, '../../.env'),
});

export const API_VERSION = "1.0.0";
const AUTH0_DOMAIN = env.parsed?.AUTH0_DOMAIN;
if (!AUTH0_DOMAIN) {
  throw new Error("AUTH0_DOMAIN is not defined");
}
const AUTH0_AUTHORIZATION_URL = `https://${AUTH0_DOMAIN}/authorize`;
const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;

// Construct an array containing all the *_PERMISSION values from the .env file
const scopesArray = Object.entries(env.parsed || {})
  .filter(([key]) => key.endsWith("_PERMISSION"))
  .map(([_, value]) => value);
scopesArray.push("openid", "profile", "email");
// Construct the scopes object for the OpenAPI spec
const scopesObject = scopesArray.reduce((acc, scope) => {
  // Desscription is the permission simply by replacing : with a space and capitalizing the first letter of each word
  const description = scope.split(":").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  acc[scope] = description; // You can provide a more detailed description if needed
  return acc;
}, {} as Record<string, string>);

const options = {
  encoding: "utf8",
  failOnErrors: false, // Whether or not to throw when parsing errors. Defaults to false.
  format: "json",
  info: {
        title: "SCTG Vite React Heroui Auth0 Template API",
    version: API_VERSION,
  },
  definition: {
    openapi: "3.0.0",
    info: {
            title: "SCTG Vite React Heroui Auth0 Template API",
      version: API_VERSION,
    },
  }, // You can move properties from definition here if needed
  apis: [
    "../cloudflare-worker/src/routes/index.ts",
    ],
};

const openApi = await swaggerJsdoc(options) as any;

openApi.components.securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
  oauth2: {
    type: "oauth2",
    description: "Auth0 OAuth2 Authorization Code Flow",
    flows: {
      authorizationCode: {
        authorizationUrl: AUTH0_AUTHORIZATION_URL,
        tokenUrl: AUTH0_TOKEN_URL,
        scopes: scopesObject,
        },
      },
    },
  };

openApi.security = [
  {
    bearerAuth: [],
  },
  {
    oauth2: [],
  },

];

// Write the OpenAPI spec to a file public/openapi.json
fs.writeFileSync(
  "./public/openapi.json",
  JSON.stringify(openApi, null, 2),
  "utf8",
);
