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

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
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
 * Show a login button for calling the Auth0 login function
 * @param text - Custom text for the button (default: "Log in")
 * @returns Login button
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
 * Show a logout button for calling the Auth0 logout function
 * @param showButtonIfNotAuthenticated - Show the button even if the user is not authenticated
 * @param text - Custom text for the button (default: "Log out")
 * @returns
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
 * Show a login or logout button based on the user's authentication status
 * @returns Login or logout button
 */
export const LoginLogoutButton: FC = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

/**
 * A higher-order component that wraps a component in an authentication guard
 * @param component
 * @returns the component wrapped in an authentication guard or a loading spinner
 * @example
 * ```tsx
 * <AuthenticationGuard component={MyComponent} />
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