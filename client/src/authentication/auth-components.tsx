/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

import { FC, ReactNode, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";

import { SiteLoading } from "../components/site-loading";

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
 * const { getJson, postJson, deleteJson, hasPermission } = useSecuredApi();
 * const data = await getJson('https://api.example.com/data');
 * await postJson('https://api.example.com/data', { key: 'value' });
 * await deleteJson('https://api.example.com/data/1');
 * ```
 */
export const useSecuredApi = () => {
  const { getJson, postJson, deleteJson, hasPermission } = useAuth();

  return {
    getJson,
    postJson,
    deleteJson,
    hasPermission,
  };
};
