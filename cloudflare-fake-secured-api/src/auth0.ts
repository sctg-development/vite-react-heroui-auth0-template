import * as jose from 'jose';

/**
 * Verify a JWT token against the Auth0 JWKS
 * @param token a JWT token
 * @param env the environment variables
 * @returns a promise that resolves to the payload of the JWT token
 */
export const verifyToken = async (token: string, env: Env): Promise<jose.JWTPayload> => {
    const JWKS = jose.createRemoteJWKSet(new URL(`https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`));

    const { payload, protectedHeader } = await jose.jwtVerify(token, JWKS,
        {
            issuer: `https://${env.AUTH0_DOMAIN}/`,
            audience: env.AUDIENCE,
        }
    );

    return payload;
};

/**
 * Check if a token has a given permission
 * @param token a JWT token
 * @param permission a permission or an array of permissions
 * @param env the environment variables
 * @returns a promise that resolves to an object with a boolean access field and the payload of the JWT token
 */
export const checkPermissions = async (token: string, permission: string | string[], env: Env): Promise<{ access: boolean, payload: jose.JWTPayload }> => {
    const payload = await verifyToken(token, env);
    let access = false;
    if (typeof permission === 'string') {
        access = (payload.permissions as string[]).includes(permission);
    } else {
        access = permission.some(p => (payload.permissions as string[]).includes(p));
    }
    return { access, payload };
}