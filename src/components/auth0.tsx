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
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { SiteLoading } from "./site-loading";

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
 * @param [props.text] - Custom text for the button. Defaults to localized "log-out" text.
 * @returns Logout button or null based on authentication status and showButtonIfNotAuthenticated setting
 */
export const LogoutButton: FC<LogoutButtonProps> = ({
  showButtonIfNotAuthenticated: showButtonIfNotAuthenticated = false,
  text,
}) => {
  const { isAuthenticated, logout } = useAuth0();
  const { t } = useTranslation();

  if (!text) {
    text = t("log-out");
  }

  return (
    (isAuthenticated || showButtonIfNotAuthenticated) && (
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
        <span>{text}</span> {Profile()}
      </Button>
    )
  );
};

/**
 * Conditionally renders either a login or logout button based on authentication status.
 * Provides a convenient way to toggle between auth actions in a single component.
 * @returns Either the LoginButton or LogoutButton component
 */
export const LoginLogoutButton: FC = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
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
    console.error(error);
    throw error;
  }
};
