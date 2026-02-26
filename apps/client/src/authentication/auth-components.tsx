/**
 * @copyright Copyright (c) 2024-2026 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

import { FC, ReactNode, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";
import { Permission } from "@/types";
import { SiteLoading } from "../components/site-loading";
import type {
  Auth0ManagementTokenApiResponse,
  Auth0User,
  Auth0Permission,
} from "../types/auth0.types";

import {
  useAuth,
  getNameWithFallback,
  withAuthentication,
} from "./providers/use-auth";

/**
 * Renders the user's profile name with a tooltip showing their username.
 * @returns The user's name with a tooltip showing their username
 */
export function Profile() {
  const { user } = useAuth();

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(user));

  return (
    <Tooltip content={user?.nickname} delay={750}>
      <span>{user?.name}</span>
    </Tooltip>
  );
}

/**
 * Renders a login button for authentication.
 * Only shows when the user is not authenticated.
 * @param props - Component props
 * @param [props.text] - Custom text for the button. Defaults to localized "log-in" text.
 * @returns Login button or null if user is already authenticated
 */
export const LoginButton: FC<{ text?: string }> = ({ text }) => {
  const { isAuthenticated, login } = useAuth();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-in");
  }

  return (
    !isAuthenticated && (
      <Button
        className="text-sm font-normal text-default-600 bg-default-100"
        type="button"
        onPress={() => login()}
      >
        {text}
      </Button>
    )
  );
};

/**
 * Renders a login link for authentication.
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
  const { isAuthenticated, login } = useAuth();
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
          login();
        }}
      >
        {text}
      </Link>
    )
  );
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
 * Renders a logout button for authentication.
 * By default, only shows when the user is authenticated.
 * @param props - Component props
 * @param [props.showButtonIfNotAuthenticated=false] - When true, shows the button even if user is not authenticated
 * @param [props.text] - Custom text for the button. Defaults to localized "log-out-someone" text filled with user name or ID
 * @returns Logout button or null based on authentication status and showButtonIfNotAuthenticated setting
 */
export const LogoutButton: FC<LogoutButtonProps> = ({
  showButtonIfNotAuthenticated = false,
  text,
}) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-out-someone", {
      name: getNameWithFallback(user),
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
 * Renders a logout link for authentication.
 * By default, only shows when the user is authenticated.
 * @param props - Component props
 * @param [props.text] - Custom text for the link. Defaults to localized "log-out-someone" text filled with user name or ID
 * @returns Logout link or null based on authentication status
 */
export const LogoutLink: FC<LogoutLinkProps> = ({
  showButtonIfNotAuthenticated = false,
  text,
  color,
}) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-out-someone", {
      name: getNameWithFallback(user),
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
  showButtonIfNotAuthenticated = false,
  text,
}) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="flex items-center gap-2">
      <LogoutButton
        showButtonIfNotAuthenticated={showButtonIfNotAuthenticated}
        text={text}
      />
    </div>
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
  showButtonIfNotAuthenticated = false,
  text,
  color,
}) => {
  const { isAuthenticated } = useAuth();

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
  const Component = withAuthentication(component, {
    onRedirecting: () => <SiteLoading />,
  });

  return <Component />;
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
  const { hasPermission } = useAuth();
  const [permitted, setPermitted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkPermission = async () => {
      try {
        const result = await hasPermission(permission);

        if (isMounted) {
          setPermitted(result);
          setIsLoading(false);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Permission check failed:", error);
        if (isMounted) {
          setPermitted(false);
          setIsLoading(false);
        }
      }
    };

    checkPermission();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [permission, hasPermission]);

  if (isLoading) {
    return <SiteLoading />;
  }

  return permitted ? <>{children}</> : <>{fallback}</>;
};

/**
 * Custom hook that provides secured API fetching capabilities
 * @returns Object with methods for secured API operations
 * @example
 * ```tsx
 * const { getJson, postJson, deleteJson, hasPermission, putJson } = useSecuredApi();
 * const data = await getJson('https://api.example.com/data');
 * await postJson('https://api.example.com/data', { key: 'value' });
 * await deleteJson('https://api.example.com/data/1');
 * await putJson('https://api.example.com/data/1', { key: 'newValue' });
 * ```
 */
export const useSecuredApi = () => {
  const { getJson, postJson, deleteJson, hasPermission, putJson } = useAuth();

  /**
   * Obtient un token Auth0 Management API via le worker (avec cache KV).
   * Nécessite la permission `auth0:admin:api`.
   */
  const getAuth0ManagementToken =
    async (): Promise<Auth0ManagementTokenApiResponse> => {
      const apiBase =
        typeof import.meta !== "undefined" &&
          (import.meta as any).env?.API_BASE_URL
          ? (import.meta as any).env.API_BASE_URL
          : "";
      const result = await postJson(`${apiBase}/__auth0/token`, {});
      return result as Auth0ManagementTokenApiResponse;
    };

  const auth0Domain =
    typeof import.meta !== "undefined" &&
      (import.meta as any).env?.VITE_AUTH0_DOMAIN
      ? (import.meta as any).env.VITE_AUTH0_DOMAIN
      : (import.meta as any)?.env?.AUTH0_DOMAIN ?? "";

  /**
   * Liste tous les utilisateurs depuis Auth0 Management API.
   * @param mgmtToken Token Auth0 Management API obtenu via getAuth0ManagementToken()
   */
  const listAuth0Users = async (mgmtToken: string): Promise<Auth0User[]> => {
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/users?per_page=100&include_totals=false`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  };

  /**
   * Récupère les permissions d'un utilisateur Auth0.
   * @param mgmtToken Token Auth0 Management API
   * @param userId Identifiant Auth0 de l'utilisateur (ex: auth0|xxx)
   */
  const getUserPermissions = async (
    mgmtToken: string,
    userId: string,
  ): Promise<Auth0Permission[]> => {
    const encodedId = encodeURIComponent(userId);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/users/${encodedId}/permissions`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  };

  /**
   * Add a permission to a Auth0 user
   * @param mgmtToken Token Auth0 Management API
   * @param userId Auth0 user ID (ex: auth0|xxx)
   * @param permissionName Permission name (ex: exercises:read)
   */
  const addPermissionToUser = async (
    mgmtToken: string,
    userId: string,
    permissionName: string,
  ): Promise<void> => {
    const apiBase =
      typeof import.meta !== "undefined" &&
        (import.meta as any).env?.API_BASE_URL
        ? (import.meta as any).env.API_BASE_URL
        : "";
    const audience = (import.meta as any)?.env?.AUTH0_AUDIENCE ?? apiBase;
    const encodedId = encodeURIComponent(userId);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/users/${encodedId}/permissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: [
            {
              resource_server_identifier: audience,
              permission_name: permissionName,
            },
          ],
        }),
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
  };

  /**
   * Remove a permission from an Auth0 user
   * @param mgmtToken Token Auth0 Management API
   * @param userId Auth0 user ID (ex: auth0|xxx)
   * @param permissionName Permission name (ex: exercises:read)
   */
  const removePermissionFromUser = async (
    mgmtToken: string,
    userId: string,
    permissionName: string,
  ): Promise<void> => {
    const apiBase =
      typeof import.meta !== "undefined" &&
        (import.meta as any).env?.API_BASE_URL
        ? (import.meta as any).env.API_BASE_URL
        : "";
    const audience = (import.meta as any)?.env?.AUTH0_AUDIENCE ?? apiBase;
    const encodedId = encodeURIComponent(userId);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/users/${encodedId}/permissions`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: [
            {
              resource_server_identifier: audience,
              permission_name: permissionName,
            },
          ],
        }),
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
  };

  /**
   * Delete an Auth0 user
   * @param mgmtToken Token Auth0 Management API
   * @param userId Auth0 user ID (ex: auth0|xxx)
   */
  const deleteAuth0User = async (
    mgmtToken: string,
    userId: string,
  ): Promise<void> => {
    const encodedId = encodeURIComponent(userId);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/users/${encodedId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
  };

  /**
   * Get the list of Resource Servers (APIs) configured in Auth0
   * @param mgmtToken Token Auth0 Management API
   */
  const getResourceServers = async (mgmtToken: string): Promise<any[]> => {
    const resp = await fetch(`https://${auth0Domain}/api/v2/resource-servers`, {
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json();
  };

  /**
   * Update the scopes of an Auth0 Resource Server
   * @param mgmtToken Token Auth0 Management API
   * @param id Auth0 Resource Server ID (ex: "65f..." or its audience)
   * @param scopes List of scopes to define
   */
  const updateResourceServerScopes = async (
    mgmtToken: string,
    id: string,
    scopes: { value: string; description: string }[],
  ): Promise<void> => {
    // Note: Auth0 accepts the ID or the identifier (URL) for the PATCH /resource-servers/{id} endpoint
    const encodedId = encodeURIComponent(id);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/resource-servers/${encodedId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scopes,
        }),
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
  };

  /**
   * Get the scopes (permissions) of a specific Auth0 Resource Server by its ID or identifier.
   * @param mgmtToken Auth0 Management API Token
   * @param id Auth0 Resource Server ID or identifier
   */
  const getResourceServerScopes = async (
    mgmtToken: string,
    id: string,
  ): Promise<{ value: string; description: string }[]> => {
    const encodedId = encodeURIComponent(id);
    const resp = await fetch(
      `https://${auth0Domain}/api/v2/resource-servers/${encodedId}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    return data.scopes ?? [];
  };

  /**
   * Get the scopes (permissions) of a Resource Server using its audience.
   * @param mgmtToken Auth0 Management API Token
   * @param audience The audience identifier (URL) of the API
   */
  const getResourcesServerScopesWithAudience = async (
    mgmtToken: string,
    audience: string,
  ): Promise<{ value: string; description: string }[]> => {
    const servers = await getResourceServers(mgmtToken);
    const server = servers.find((s) => s.identifier === audience);
    if (!server) throw new Error(`Resource server with audience ${audience} not found`);
    return getResourceServerScopes(mgmtToken, server.id);
  };

  /**
   * Update the scopes of a Resource Server using its audience.
   * @param mgmtToken Auth0 Management API Token
   * @param audience The audience identifier of the API
   * @param scopes Complete list of scopes to set
   */
  const updateResourceServerScopesWithAudience = async (
    mgmtToken: string,
    audience: string,
    scopes: { value: string; description: string }[],
  ): Promise<void> => {
    const servers = await getResourceServers(mgmtToken);
    const server = servers.find((s) => s.identifier === audience);
    if (!server) throw new Error(`Resource server with audience ${audience} not found`);
    return updateResourceServerScopes(mgmtToken, server.id, scopes);
  };

  /**
   * Check if a set of scopes exactly matches those defined on a Resource Server.
   * @param mgmtToken Auth0 Management API Token
   * @param id Resource Server ID or identifier
   * @param targetScopes The scopes we want to verify
   * @returns true if synchronized, false if update is needed
   */
  const checkResourceServerScopes = async (
    mgmtToken: string,
    id: string,
    targetScopes: { value: string; description: string }[],
  ): Promise<boolean> => {
    const currentScopes = await getResourceServerScopes(mgmtToken, id);
    if (currentScopes.length !== targetScopes.length) return false;

    const currentValues = new Set(currentScopes.map((s) => s.value));
    const targetValues = new Set(targetScopes.map((s) => s.value));

    // Check if every target scope exists in current ones
    for (const val of targetValues) {
      if (!currentValues.has(val)) return false;
    }
    // Since lengths are equal, if all target are in current, they are identical
    return true;
  };

  /**
   * Check if scopes are synchronized using the audience to find the server.
   * @param mgmtToken Auth0 Management API Token
   * @param audience API audience
   * @param targetScopes Scopes to verify
   */
  const checkResourceServerScopesWithAudience = async (
    mgmtToken: string,
    audience: string,
    targetScopes: { value: string; description: string }[],
  ): Promise<boolean> => {
    const servers = await getResourceServers(mgmtToken);
    const server = servers.find((s) => s.identifier === audience);
    if (!server) throw new Error(`Resource server with audience ${audience} not found`);
    return checkResourceServerScopes(mgmtToken, server.id, targetScopes);
  };

  return {
    getJson,
    postJson,
    deleteJson,
    hasPermission,
    putJson,
    // Auth0 Management API
    getAuth0ManagementToken,
    listAuth0Users,
    getUserPermissions,
    addPermissionToUser,
    removePermissionFromUser,
    deleteAuth0User,
    getResourceServers,
    updateResourceServerScopes,
    getResourceServerScopes,
    getResourcesServerScopesWithAudience,
    updateResourceServerScopesWithAudience,
    checkResourceServerScopes,
    checkResourceServerScopesWithAudience,
  };
};
