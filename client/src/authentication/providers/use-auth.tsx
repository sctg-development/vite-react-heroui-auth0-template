/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */

import React, { createContext, useContext, ReactNode, JSX } from "react";

import { AuthProvider, AuthUser } from "./auth-provider";
import { useAuth0Provider } from "./auth0-provider";
import { useDexProvider } from "./dex-provider";

// Create context for the authentication provider
const AuthContext = createContext<AuthProvider | null>(null);

// Props for the provider wrapper component
interface AuthProviderWrapperProps {
  children: ReactNode;
  providerType?: "auth0" | "dex";
}

/**
 * Wrapper component that provides authentication context
 */
export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({
  children,
  providerType = "auth0",
}) => {
  // Select the appropriate provider implementation based on the type
  let authProvider: AuthProvider;

  switch (providerType) {
    case "auth0":
      authProvider = useAuth0Provider();
      break;
    // Uncomment when needed
    case "dex":
      authProvider = useDexProvider();
      break;
    default:
      // Default to Auth0
      authProvider = useAuth0Provider();
  }

  return (
    <AuthContext.Provider value={authProvider}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication provider
 */
export const useAuth = (): AuthProvider => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProviderWrapper");
  }

  return context;
};

/**
 * Function to get the user's name with fallback options
 */
export const getNameWithFallback = (user: AuthUser | null): string => {
  return user?.nickname || user?.name || user?.sub || "";
};

/**
 * Higher-order component to protect routes requiring authentication
 */
export const withAuthentication = (
  Component: React.FC,
  options?: { onRedirecting?: () => JSX.Element },
): React.FC => {
  return function ProtectedRoute(props: any) {
    const auth = useAuth();

    // If still loading, show loading state
    if (auth.isLoading) {
      return options?.onRedirecting ? options.onRedirecting() : null;
    }

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
      auth.login();

      return options?.onRedirecting ? options.onRedirecting() : null;
    }

    // If authenticated, render the protected component
    return <Component {...props} />;
  };
};
