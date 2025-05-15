/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

import {
  useAuth0,
  withAuthenticationRequired,
  LogoutOptions as Auth0LogoutOptions,
  RedirectLoginOptions,
} from "@auth0/auth0-react";
import React, { JSX } from "react";
import { createRemoteJWKSet, JWTPayload, jwtVerify } from "jose";

import {
  AuthProvider,
  AuthUser,
  TokenOptions,
  LogoutOptions,
  LoginOptions,
  AuthGuardProps,
} from "./auth-provider";

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

  const getAccessToken = async (
    options?: TokenOptions,
  ): Promise<string | null> => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: options?.audience || import.meta.env.AUTH0_AUDIENCE,
          scope: options?.scope || import.meta.env.AUTH0_SCOPE,
        },
        ...options,
      });

      return token;
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

  const hasPermission = async (permission: string): Promise<boolean> => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return false;
      }

      const JWKS = createRemoteJWKSet(
        new URL(
          `https://${import.meta.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        ),
      );

      const joseResult = await jwtVerify(accessToken, JWKS, {
        issuer: `https://${import.meta.env.AUTH0_DOMAIN}/`,
        audience: import.meta.env.AUTH0_AUDIENCE,
      });

      const payload = joseResult.payload as JWTPayload;

      if (payload.permissions instanceof Array) {
        return payload.permissions.includes(permission);
      } else {
        return false;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error checking permission:", error);

      return false;
    }
  };

  const getJson = async (url: string): Promise<any> => {
    try {
      const accessToken = await getAccessToken();

      const apiResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await apiResponse.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching JSON:", error);
      throw error;
    }
  };

  const postJson = async (url: string, data: any): Promise<any> => {
    try {
      const accessToken = await getAccessToken();

      const apiResponse = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await apiResponse.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error posting JSON:", error);
      throw error;
    }
  };

  const deleteJson = async (url: string): Promise<any> => {
    try {
      const accessToken = await getAccessToken();

      const apiResponse = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return await apiResponse.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error deleting JSON:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user: user as AuthUser,
    login,
    logout,
    getAccessToken,
    hasPermission,
    getJson,
    postJson,
    deleteJson,
  };
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
