/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

// Re-export components and hooks
export {
  useAuth,
  getNameWithFallback,
  withAuthentication,
} from "./providers/use-auth";
export {
  useAuth0Provider,
  withAuth0Authentication,
} from "./providers/auth0-provider";
// export { useDexProvider } from './providers/dex-provider';
export { AuthenticationProvider, type AuthenticationType } from "./auth-root";

// Export interfaces
export type {
  AuthProvider,
  AuthUser,
  TokenOptions,
  LoginOptions,
  LogoutOptions,
  AuthProviderConfig,
  AuthGuardProps,
  AuthPermissionGuardProps,
} from "./providers/auth-provider";

// Export UI components
export {
  Profile,
  LoginButton,
  LoginLink,
  LogoutButton,
  LogoutLink,
  LoginLogoutButton,
  LoginLogoutLink,
  AuthenticationGuard,
  AuthenticationGuardWithPermission,
  useSecuredApi,
} from "./auth-components";
