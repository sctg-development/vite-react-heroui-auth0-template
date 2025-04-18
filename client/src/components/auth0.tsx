/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
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

import {
  GetTokenSilentlyOptions,
  useAuth0,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@heroui/link";
import { createRemoteJWKSet, JWTPayload, jwtVerify } from "jose";

import { SiteLoading } from "./site-loading";

/**
 * Renders the user's profile name with a tooltip showing their username.
 * @returns The user's name with a tooltip showing their username
 */
export function Profile() {
  const { user } = useAuth0();

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(user));

  return (
    <Tooltip content={user?.nickname} delay={750}>
      <span>{user?.name}</span>
    </Tooltip>
  );
}

/**
 * Renders a login button for Auth0 authentication.
 * Only shows when the user is not authenticated.
 * @param props - Component props
 * @param [props.text] - Custom text for the button. Defaults to localized "log-in" text.
 * @returns Login button or null if user is already authenticated
 */
export const LoginButton: FC<{ text?: string }> = ({ text }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-in");
  }

  return (
    !isAuthenticated && (
      <Button
        className="text-sm font-normal text-default-600 bg-default-100"
        type="button"
        onPress={() => loginWithRedirect()}
      >
        {text}
      </Button>
    )
  );
};

/**
 * Renders a login link for Auth0 authentication.
 * Only shows when the user is not authenticated.
 * @param props - Component props
 * @param [props.text] - Custom text for the link. Defaults to localized "log-in" text.
 * @returns Login link or null if user is already authenticated
 */
export const LoginLink: FC<{
  text?: string;
  color?:
    | "primary"
    | "foreground"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}> = ({ text, color }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-in");
  }

  return (
    !isAuthenticated && (
      <Link
        color={color}
        size="lg"
        onPress={() => {
          loginWithRedirect();
        }}
      >
        {text}
      </Link>
    )
  );
};

/**
 * Gets the user's name from the Auth0 user object with a fallback to other properties.
 * @returns the user's name, nickname, or sub property from the Auth0 user object
 */
export const getNameWithFailback = () => {
  const { user } = useAuth0();

  return user?.nickname || user?.name || user?.sub || "";
};

interface LogoutButtonProps {
  /**
   * Show the button even if the user is not authenticated
   */
  showButtonIfNotAuthenticated?: boolean;
  /**
   * Custom text for the button
   */
  text?: string;
}

/**
 * Renders a logout button for Auth0 authentication.
 * By default, only shows when the user is authenticated.
 * @param props - Component props
 * @param [props.showButtonIfNotAuthenticated=false] - When true, shows the button even if user is not authenticated
 * @param [props.text] - Custom text for the button. Defaults to localized "log-out-someone" text filled with user name or ID
 * @returns Logout button or null based on authentication status and showButtonIfNotAuthenticated setting
 */
export const LogoutButton: FC<LogoutButtonProps> = ({
  showButtonIfNotAuthenticated: showButtonIfNotAuthenticated = false,
  text,
}) => {
  const { isAuthenticated, logout, user } = useAuth0();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-out-someone", {
      name: getNameWithFailback(),
    });
  }

  return (
    (isAuthenticated || showButtonIfNotAuthenticated) && (
      <Tooltip
        content={`${user?.name || ""}\n${user?.nickname || ""}\n${user?.email || ""}\n${user?.sub || ""} `}
        delay={750}
      >
        <Button
          className="text-sm font-normal text-default-600 bg-default-100"
          type="button"
          onPress={() => {
            logout({
              logoutParams: {
                returnTo: new URL(
                  import.meta.env.BASE_URL || "/",
                  window.location.origin,
                ).toString(),
              },
            });
          }}
        >
          <span>{text}</span>
        </Button>
      </Tooltip>
    )
  );
};

interface LogoutLinkProps extends LogoutButtonProps {
  /**
   * Button color
   */
  color?:
    | "primary"
    | "foreground"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}
/**
 * Renders a logout link for Auth0 authentication.
 * By default, only shows when the user is authenticated.
 * @param props - Component props
 * @param [props.text] - Custom text for the link. Defaults to localized "log-out-someone" text filled with user name or ID
 * @returns Logout link or null based on authentication status
 */
export const LogoutLink: FC<LogoutLinkProps> = ({
  showButtonIfNotAuthenticated: showButtonIfNotAuthenticated = false,
  text,
  color,
}) => {
  const { isAuthenticated, logout } = useAuth0();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-out-someone", {
      name: getNameWithFailback(),
    });
  }

  return isAuthenticated || showButtonIfNotAuthenticated ? (
    <>
      <Link
        color={color}
        size="lg"
        onPress={() => {
          logout({
            logoutParams: {
              returnTo: new URL(
                import.meta.env.BASE_URL || "/",
                window.location.origin,
              ).toString(),
            },
          });
        }}
      >
        {text}
      </Link>
    </>
  ) : null;
};

/**
 * Conditionally renders either a login or logout button based on authentication status.
 * Provides a convenient way to toggle between auth actions in a single component.
 * @returns Either the LoginButton or LogoutButton component
 */
export const LoginLogoutButton: FC<LogoutButtonProps> = ({
  showButtonIfNotAuthenticated: showButtonIfNotAuthenticated = false,
  text,
}) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <LogoutButton
      showButtonIfNotAuthenticated={showButtonIfNotAuthenticated}
      text={text}
    />
  ) : (
    <LoginButton />
  );
};

/**
 * Conditionally renders either a login or logout link based on authentication status.
 * Provides a convenient way to toggle between auth actions in a single component.
 * @returns Either the LoginLink or LogoutLink component
 */
export const LoginLogoutLink: FC<LogoutLinkProps> = ({
  showButtonIfNotAuthenticated: showButtonIfNotAuthenticated = false,
  text,
  color,
}) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <LogoutLink
      color={color}
      showButtonIfNotAuthenticated={showButtonIfNotAuthenticated}
      text={text}
    />
  ) : (
    <LoginLink />
  );
};

/**
 * Higher-order component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page and shows a loading state during the redirect.
 * @param props - Component props
 * @param props.component - The component to render when the user is authenticated
 * @returns The protected component or loading state
 * @example
 * ```tsx
 * <AuthenticationGuard component={ProtectedDashboard} />
 * ```
 */
export const AuthenticationGuard: FC<{ component: FC }> = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <>
        <SiteLoading />
      </>
    ),
  });

  return <Component />;
};

/**
 * Simple type matching the Auth0 getAccessTokenSilently function
 */
export type GetAccessTokenFunction = {
  (options: GetTokenSilentlyOptions): Promise<any>;
};

/**
 * Fetches JSON data from a secured API endpoint using Auth0 token authentication.
 * Handles the token acquisition and authorization header setup automatically.
 *
 * @param {string} url - The URL of the secured API endpoint to fetch data from
 * @param {GetAccessTokenFunction} getAccessTokenFunction - Function to retrieve an access token, typically Auth0's getAccessTokenSilently
 * @returns {Promise<any>} Promise resolving to the JSON response from the API
 * @throws {Error} If token acquisition fails or the API request fails
 * @example
 * ```tsx
 * const { getAccessTokenSilently } = useAuth0();
 * const data = await getJsonFromSecuredApi('https://api.example.com/data', getAccessTokenSilently);
 * ```
 */
export const getJsonFromSecuredApi = async (
  url: string,
  getAccessTokenFunction: GetAccessTokenFunction,
) => {
  try {
    const accessToken = await getAccessTokenFunction({
      authorizationParams: {
        audience: import.meta.env.AUTH0_AUDIENCE,
        scope: import.meta.env.AUTH0_SCOPE,
      },
    });
    const apiResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await apiResponse.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

/**
 * Posts JSON data to a secured API endpoint using Auth0 token authentication.
 * Handles the token acquisition and authorization header setup automatically.
 * @param {string} url - The URL of the secured API endpoint to post data to
 * @param {any} data - The JSON data to post to the API
 * @param {GetAccessTokenFunction} getAccessTokenFunction - Function to retrieve an access token, typically Auth0's getAccessTokenSilently
 * @returns {Promise<any>} Promise resolving to the JSON response from the API
 */
export const postJsonToSecuredApi = async (
  url: string,
  data: any,
  getAccessTokenFunction: GetAccessTokenFunction,
) => {
  try {
    const accessToken = await getAccessTokenFunction({
      authorizationParams: {
        audience: import.meta.env.AUTH0_AUDIENCE,
        scope: import.meta.env.AUTH0_SCOPE,
      },
    });
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
    console.error(error);
    throw error;
  }
};

/**
 * Checks if the user has a specific permission.
 * @param permission - The permission to check for
 * @param {GetAccessTokenFunction} getAccessTokenFunction - Function to retrieve an access token, typically Auth0's getAccessTokenSilently
 * @returns {Promise<boolean>} Promise resolving to true if the user has the permission, false otherwise
 * @throws {Error} If token acquisition fails or the API request fails
 */
export const userHasPermission = async (
  permission: string,
  getAccessTokenFunction: GetAccessTokenFunction,
) => {
  try {
    const accessToken = await getAccessTokenFunction({
      authorizationParams: {
        audience: import.meta.env.AUTH0_AUDIENCE,
        scope: import.meta.env.AUTH0_SCOPE,
      },
    });

    if (!accessToken) {
      return false;
    }
    const JWKS = createRemoteJWKSet(
      new URL(`https://${import.meta.env.AUTH0_DOMAIN}/.well-known/jwks.json`),
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
    console.error(error);
    throw error;
  }
};

/**
 * Component that conditionally renders its children based on whether the user has a specific permission.
 *
 * @param props - Component props
 * @param props.permission - The required permission to display the content
 * @param props.children - The child elements to display if the user has the permission
 * @param props.fallback - Optional element to display if the user lacks the permission (defaults to empty fragment)
 * @returns The children if the user has the permission, otherwise the fallback
 *
 * @example
 * ```tsx
 * <AuthenticationGuardWithPermission permission="read:api">
 *   <ProtectedComponent />
 * </AuthenticationGuardWithPermission>
 * ```
 */
export const AuthenticationGuardWithPermission: FC<{
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ permission, children, fallback = <></> }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkPermission = async () => {
      try {
        const result = await userHasPermission(
          permission,
          getAccessTokenSilently,
        );

        if (isMounted) {
          setHasPermission(result);
          setIsLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Permission check failed:", error);
        if (isMounted) {
          setHasPermission(false);
          setIsLoading(false);
        }
      }
    };

    checkPermission();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently, permission]);

  if (isLoading) {
    return <SiteLoading />;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * Custom hook that provides secured API fetching capabilities
 * @returns Object with methods for secured API operations
 * @example
 * ```tsx
 * const { getJson, postJson, deleteJson } = useSecuredApi();
 * const data = await getJson('https://api.example.com/data');
 * await postJson('https://api.example.com/data', { key: 'value' });
 * await deleteJson('https://api.example.com/data/1');
 * ```
 */
export const useSecuredApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getJson = async (url: string) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.AUTH0_AUDIENCE,
          scope: import.meta.env.AUTH0_SCOPE,
        },
      });

      const apiResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return await apiResponse.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  };

  const postJson = async (url: string, data: any) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.AUTH0_AUDIENCE,
          scope: import.meta.env.AUTH0_SCOPE,
        },
      });

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
      console.error(error);
      throw error;
    }
  };

  const deleteJson = async (url: string) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.AUTH0_AUDIENCE,
          scope: import.meta.env.AUTH0_SCOPE,
        },
      });

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
      console.error(error);
      throw error;
    }
  };

  /**
   * Returns a boolean indicating if the user has the specified permission
   * This function uses the Auth0 access token to verify the user's permissions
   * It fetches the JSON Web Key Set (JWKS) from Auth0 and verifies the token
   * against the JWKS to extract the permissions from the token payload
   * If the permissions are an array, it checks if the specified permission is included
   * If the permissions are not an array, it returns false
   * If any error occurs during the process, it logs the error and throws it
   * This function is useful for checking if the user has the required permissions
   * to access certain resources or perform certain actions in the application
   * It can be used in conjunction with the getJson, postJson, and deleteJson functions
   * to perform API requests with the appropriate authorization
   * and permissions
   * @param permission - The permission to check for
   * @returns A promise that resolves to true if the user has the permission, false otherwise
   * @throws {Error} If token acquisition fails or the API request fails
   * @example
   * ```tsx
   * const { hasPermission } = useSecuredApi();
   * const hasAccess = await hasPermission('read:api');
   * if (hasAccess) {
   *   // User has permission
   * } else {
   *   // User does not have permission
   * }
   * ```
   */
  const hasPermission = async (permission: string) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.AUTH0_AUDIENCE,
          scope: import.meta.env.AUTH0_SCOPE,
        },
      });

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
      console.error(error);
      throw error;
    }
  };

  return {
    getJson,
    postJson,
    deleteJson,
    hasPermission,
  };
};
