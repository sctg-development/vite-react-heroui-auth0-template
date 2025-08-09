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
import * as jose from "jose";

/**
 * Verify a JWT token against the Auth0 JWKS
 * @param token a JWT token
 * @param env the environment variables
 * @returns a promise that resolves to the payload of the JWT token
 */
export const verifyToken = async (
	token: string,
	env: Env,
): Promise<jose.JWTPayload> => {
	let jwksUrl = "";

	// If provider is Auth0 we use the AUTH0_DOMAIN for creating the JWKS URL
	if (env.AUTHENTICATION_PROVIDER_TYPE === "auth0") {
		jwksUrl = `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`;
	} else if (env.AUTHENTICATION_PROVIDER_TYPE === "dex") {
		// If provider is Dex we use the DEX_JWKS_ENDPOINT for creating the JWKS URL
		jwksUrl = env.DEX_JWKS_ENDPOINT;
	} else {
		throw new Error(
			`Unsupported authentication provider: ${env.AUTHENTICATION_PROVIDER_TYPE}`,
		);
	}
	const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));

	const { payload } = await jose.jwtVerify(token, JWKS, {
		issuer: `https://${env.AUTH0_DOMAIN}/`,
		audience: env.AUTH0_AUDIENCE,
	});

	return payload;
};

/**
 * Check if a token has a given permission
 * @param token a JWT token
 * @param permission a permission or an array of permissions
 * @param env the environment variables
 * @returns a promise that resolves to an object with a boolean access field and the payload of the JWT token
 */
export const checkPermissions = async (
	token: string,
	permission: string | string[],
	env: Env,
): Promise<{ access: boolean; payload: jose.JWTPayload }> => {
	const payload = await verifyToken(token, env);
	let access = false;

	if (typeof permission === "string") {
		access = (payload.permissions as string[]).includes(permission);
	} else {
		access = permission.some((p) =>
			(payload.permissions as string[]).includes(p),
		);
	}

	return { access, payload };
};
