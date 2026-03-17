/**
 * @copyright Copyright (c) 2024-2026 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

import {
  useAuth0,
  withAuthenticationRequired,
  LogoutOptions as Auth0LogoutOptions,
  RedirectLoginOptions,
  GetTokenSilentlyOptions,
} from "@auth0/auth0-react";
import React, { JSX, useCallback, useMemo, useRef } from "react";
import { JWTPayload, jwtVerify } from "jose";

import {
  AuthProvider,
  AuthUser,
  TokenOptions,
  LogoutOptions,
  LoginOptions,
  AuthGuardProps,
} from "./auth-provider";

import { getLocalJwkSet } from "@/authentication/utils/jwks";

/**
 * Auth0 implementation of the AuthProvider interface
 */
export const useAuth0Provider = (): AuthProvider => {
  const {
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  /**
   * Decode a JWT payload without validating the signature.
   * This is only used for token expiration checks.
   */
  const parseJwtPayload = (token: string): JWTPayload | null => {
    try {
      const [, payload] = token.split(".");
      if (!payload) return null;

      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      return JSON.parse(json) as JWTPayload;
    } catch {
      return null;
    }
  };

  const normalizeAccessToken = (token: unknown): string => {
    if (typeof token === "string") return token;
    if (token && typeof token === "object" && "accessToken" in token) {
      return (token as any).accessToken ?? "";
    }
    return "";
  };

  const getAccessTokenWithAutoRefresh = async (
    getAccessTokenSilentlyFn: typeof getAccessTokenSilently,
    options: GetTokenSilentlyOptions,
  ): Promise<string> => {
    const rawToken = await getAccessTokenSilentlyFn(options);
    const accessToken = normalizeAccessToken(rawToken);

    const payload = parseJwtPayload(accessToken);

    if (!payload?.exp) return accessToken;

    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = payload.exp - now;

    if (secondsLeft < 10) {
      const refreshOptions = { ...options, ignoreCache: true } as any;
      const refreshedRawToken = await getAccessTokenSilentlyFn(refreshOptions);
      return normalizeAccessToken(refreshedRawToken);
    }

    return accessToken;
  };

  const buildTokenOptions = (
    options?: TokenOptions,
  ): GetTokenSilentlyOptions => ({
    authorizationParams: {
      audience: options?.audience || import.meta.env.AUTH0_AUDIENCE,
      scope: options?.scope || import.meta.env.AUTH0_SCOPE,
    },
    ...options,
  });

  const getAccessToken = async (
    options?: TokenOptions,
  ): Promise<string | null> => {
    try {
      const tokenOptions = buildTokenOptions(options);
      return await getAccessTokenWithAutoRefresh(
        getAccessTokenSilently,
        tokenOptions,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error getting access token:", error);

      return null;
    }
  };

  const login = async (options?: LoginOptions): Promise<void> => {
    return loginWithRedirect(options as RedirectLoginOptions);
  };

  const logout = async (options?: LogoutOptions): Promise<void> => {
    const auth0Options: Auth0LogoutOptions = {
      ...options,
      logoutParams: {
        returnTo:
          options?.logoutParams?.returnTo ||
          new URL(
            import.meta.env.BASE_URL || "/",
            window.location.origin,
          ).toString(),
        ...options?.logoutParams,
      },
    };

    auth0Logout(auth0Options);

    return Promise.resolve();
  };

  // In-memory cache for permission checks keyed by `${permission}:${accessToken}`
  const permissionCheckCache = useMemo(() => new Map<string, boolean>(), []);

  const hasPermission = useCallback(
    async (permission: string): Promise<boolean> => {
      try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
          return false;
        }

        const cacheKey = `${permission}:${accessToken}`;

        if (permissionCheckCache.has(cacheKey)) {
          return permissionCheckCache.get(cacheKey) as boolean;
        }

        const localSet = await getLocalJwkSet(import.meta.env.AUTH0_DOMAIN);

        const joseResult = await jwtVerify(accessToken, localSet, {
          issuer: `https://${import.meta.env.AUTH0_DOMAIN}/`,
          audience: import.meta.env.AUTH0_AUDIENCE,
        });

        const payload = joseResult.payload as JWTPayload;
        const result =
          Array.isArray(payload.permissions) &&
          payload.permissions.includes(permission);

        permissionCheckCache.set(cacheKey, result);

        return result;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error checking permission:", error);

        return false;
      }
    },
    [getAccessToken, permissionCheckCache],
  );

  // Simple in-memory request cache to dedupe identical requests while active
  const requestCacheRef = useRef<Map<string, Promise<any>>>(new Map());

  const getJson = useCallback(
    async (url: string): Promise<any> => {
      try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
          throw new Error("Unable to get access token");
        }

        const cacheKey = `${accessToken}:${url}`;

        if (requestCacheRef.current.has(cacheKey)) {
          return await requestCacheRef.current.get(cacheKey)!;
        }

        const fetchWithToken = async (token: string): Promise<any> => {
          const apiResponse = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (apiResponse.status === 401) {
            const refreshedToken = normalizeAccessToken(
              await getAccessTokenSilently(
                { ...buildTokenOptions(), ignoreCache: true } as any,
              ),
            );

            const retryCacheKey = `${refreshedToken}:${url}`;
            if (requestCacheRef.current.has(retryCacheKey)) {
              return await requestCacheRef.current.get(retryCacheKey)!;
            }

            const retryPromise = (async () => {
              const retryResponse = await fetch(url, {
                headers: {
                  Authorization: `Bearer ${refreshedToken}`,
                },
              });

              return await retryResponse.json();
            })();

            requestCacheRef.current.set(retryCacheKey, retryPromise);

            const retryData = await retryPromise;
            requestCacheRef.current.set(retryCacheKey, Promise.resolve(retryData));
            return retryData;
          }

          return await apiResponse.json();
        };

        const promise = fetchWithToken(accessToken);

        // store the in-flight promise to dedupe concurrent calls
        requestCacheRef.current.set(cacheKey, promise);

        try {
          const data = await promise;

          // keep the resolved promise in cache (could also replace by data)
          requestCacheRef.current.set(cacheKey, Promise.resolve(data));

          return data;
        } catch (err) {
          // remove failed promise from cache
          requestCacheRef.current.delete(cacheKey);
          throw err;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching JSON:", error);
        throw error;
      }
    },
    [getAccessToken, getAccessTokenSilently],
  );

  const postJson = useCallback(
    async (url: string, data: any): Promise<any> => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Unable to get access token");
        }

        const apiResponse = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (apiResponse.status === 401) {
          const refreshedToken = normalizeAccessToken(
            await getAccessTokenSilently(
              { ...buildTokenOptions(), ignoreCache: true } as any,
            ),
          );

          const retryResponse = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          return await retryResponse.json();
        }

        return await apiResponse.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error posting JSON:", error);
        throw error;
      }
    },
    [getAccessToken, getAccessTokenSilently],
  );

  const deleteJson = useCallback(
    async (url: string): Promise<any> => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Unable to get access token");
        }

        const apiResponse = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (apiResponse.status === 401) {
          const refreshedToken = normalizeAccessToken(
            await getAccessTokenSilently(
              { ...buildTokenOptions(), ignoreCache: true } as any,
            ),
          );

          const retryResponse = await fetch(url, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
              "Content-Type": "application/json",
            },
          });

          return await retryResponse.json();
        }

        return await apiResponse.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting JSON:", error);
        throw error;
      }
    },
    [getAccessToken, getAccessTokenSilently],
  );

  const putJson = useCallback(
    async (url: string, data: any): Promise<any> => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Unable to get access token");
        }

        const apiResponse = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (apiResponse.status === 401) {
          const refreshedToken = normalizeAccessToken(
            await getAccessTokenSilently(
              { ...buildTokenOptions(), ignoreCache: true } as any,
            ),
          );

          const retryResponse = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          return await retryResponse.json();
        }

        return await apiResponse.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error putting JSON:", error);
        throw error;
      }
    },
    [getAccessToken, getAccessTokenSilently],
  );

  const patchJson = useCallback(
    async (url: string, data: any): Promise<any> => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error("Unable to get access token");
        }

        const apiResponse = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (apiResponse.status === 401) {
          const refreshedToken = normalizeAccessToken(
            await getAccessTokenSilently(
              { ...buildTokenOptions(), ignoreCache: true } as any,
            ),
          );

          const retryResponse = await fetch(url, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${refreshedToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          return await retryResponse.json();
        }

        return await apiResponse.json();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error patching JSON:", error);
        throw error;
      }
    },
    [getAccessToken, getAccessTokenSilently],
  );
  // Memoize the returned API surface so consumers receive stable function identities
  return useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user: user as AuthUser,
      login,
      logout,
      getAccessToken,
      hasPermission,
      getJson,
      postJson,
      putJson,
      deleteJson,
      patchJson,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      getAccessToken,
      hasPermission,
      getJson,
      postJson,
      putJson,
      patchJson,
      deleteJson,
    ],
  );
};

/**
 * HOC that protects routes requiring authentication with Auth0
 * @param component - The component to protect
 * @param options - Authentication options
 */
export const withAuth0Authentication = (
  component: React.FC,
  options?: { onRedirecting?: () => JSX.Element },
) => {
  return withAuthenticationRequired(component, options);
};

/**
 * Authentication Guard component specific to Auth0
 */
export const Auth0AuthenticationGuard: React.FC<AuthGuardProps> = ({
  component,
  onRedirecting,
}) => {
  const Component = withAuth0Authentication(component, {
    onRedirecting,
  });

  return <Component />;
};
