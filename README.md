# Vite, OAuth & HeroUI Template

This is a monorepo template for creating applications using Vite 7, HeroUI (v2) and a flexible authentication layer that supports multiple OAuth providers (Auth0, Dex, and more). Built with Turborepo and Yarn 4 workspaces for optimal developer experience and performance.

[Try it on CodeSandbox](https://githubbox.com/sctg-development/vite-react-heroui-auth0-template)

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

## Live demo

[<img width="1271" alt="demo" src="https://github.com/user-attachments/assets/f41f1fc3-ab50-40af-8ece-af4602812cc3" />](https://sctg-development.github.io/vite-react-heroui-auth0-template)

## On Github Pages ?

Ths plugin uses our [@sctg/vite-plugin-github-pages-spa](https://github.com/sctg-development/vite-plugin-github-pages-spa) Vite 6 plugin for handling the Github Pages limitations with SPA.

## Features

- 🚀 Fast development with Vite 7
- 🎨 Beautiful UI components from HeroUI v2
- 🔐 Flexible authentication with multiple OAuth providers (Auth0, Dex)
- 🌐 Internationalization with i18next (6 languages included)
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🍪 Cookie consent management
- 🧩 Type-safe with TypeScript
- 🧹 Code quality with ESLint 9
- 📦 Optimized build with manual chunk splitting
- ⚡ Turborepo for intelligent caching and parallel builds
- 🧶 Yarn 4 workspaces for efficient dependency management

## Technologies Used

- [Vite 7](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [React 19](https://reactjs.org)
- [i18next](https://www.i18next.com)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [OIDC Client TS](https://github.com/authts/oidc-client-ts) (For Dex and other OAuth providers)
- [ESLint 9](https://eslint.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [Turborepo](https://turbo.build/) (Monorepo build system)
- [Yarn 4](https://yarnpkg.com/) (Package manager with workspaces)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sctg-development/vite-react-heroui-auth0-template.git

# Change directory
cd vite-react-heroui-auth0-template

# Install Yarn 4 (if not already installed)
corepack enable
yarn set version 4.9.2

# Install all dependencies (uses Yarn workspaces)
yarn install

# Create a .env file with your Auth0 credentials
cat <<EOF > .env
AUTHENTICATION_PROVIDER_TYPE=auth0
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_DOMAIN=your-auth0-domain
AUTH0_SCOPE="openid profile email read:api write:api admin:api"
AUTH0_AUDIENCE=http://localhost:5173
API_BASE_URL=http://localhost:8787/api
CORS_ORIGIN=http://localhost:5173
READ_PERMISSION=read:api
WRITE_PERMISSION=write:api
ADMIN_PERMISSION=admin:api
EOF

# Start both applications with environment variables
yarn dev:env
```

For more detailed commands, see the [Turborepo Guide](./TURBOREPO-GUIDE.md).

## Table of Contents

- [Vite, OAuth \& HeroUI Template](#vite-oauth--heroui-template)
  - [Star the project](#star-the-project)
  - [Live demo](#live-demo)
  - [On Github Pages ?](#on-github-pages-)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Quick Start](#quick-start)
  - [Table of Contents](#table-of-contents)
  - [Authentication](#authentication)
    - [Setting Up Auth0](#setting-up-auth0)
    - [Environment Variables](#environment-variables)
    - [GitHub secrets](#github-secrets)
    - [Authentication Route Guard](#authentication-route-guard)
    - [Secure API Calls](#secure-api-calls)
      - [Auth0 API Configuration](#auth0-api-configuration)
      - [Making Secure API Calls](#making-secure-api-calls)
      - [Using the Authentication API Directly](#using-the-authentication-api-directly)
      - [Checking Permissions](#checking-permissions)
      - [Protect a Component with a needed permission](#protect-a-component-with-a-needed-permission)
      - [Testing with Cloudflare Workers](#testing-with-cloudflare-workers)
      - [Understanding Token Flow](#understanding-token-flow)
  - [Internationalization](#internationalization)
    - [Adding a New Language](#adding-a-new-language)
    - [Language Switch Component](#language-switch-component)
    - [Example Usage](#example-usage)
    - [Lazy Loading](#lazy-loading)
    - [Summary](#summary)
  - [Cookie Consent](#cookie-consent)
    - [Features](#features-1)
    - [Configuration](#configuration)
    - [Implementation Details](#implementation-details)
    - [Using Cookie Consent in Your Components](#using-cookie-consent-in-your-components)
    - [Customization](#customization)
  - [Project Structure](#project-structure)
  - [Available Scripts in the frontend application](#available-scripts-in-the-frontend-application)
  - [Deployment](#deployment)
  - [Tailwind CSS 4](#tailwind-css-4)
  - [How to Use](#how-to-use)
    - [Manual chunk splitting (frontend)](#manual-chunk-splitting-frontend)
    - [Install dependencies](#install-dependencies)
    - [Run the development server](#run-the-development-server)
    - [Run the Cloudflare Worker](#run-the-cloudflare-worker)
    - [Setup pnpm (optional)](#setup-pnpm-optional)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authentication Architecture](#authentication-architecture)
    - [Authentication Provider Interface](#authentication-provider-interface)
    - [Setting Up the Authentication Provider](#setting-up-the-authentication-provider)
    - [Auth0 Configuration](#auth0-configuration)
    - [Dex Configuration](#dex-configuration)
    - [Adding New Providers](#adding-new-providers)

## Authentication

This template provides a flexible authentication system with support for multiple OAuth providers. The architecture uses an abstraction layer that allows you to easily switch between different providers while maintaining a consistent API. Currently, the template supports:

- **Auth0** (Default) - Using the Auth0 React SDK
- **Dex** - Using the OIDC Client TS library

The authentication system can be extended to support other OAuth providers like Azure AD, Okta, or any OAuth 2.0 compliant service by implementing the provider interface.

### Setting Up Auth0

1. **Create an Auth0 Account:**
   - Go to [Auth0](https://auth0.com) and sign up for a free account.

2. **Create a New Application:**
   - In the Auth0 dashboard, navigate to the "Applications" section.
   - Click on "Create Application".
   - Choose a name for your application.
   - Select "Single Page Web Applications" as the application type.
   - Click "Create".

3. **Configure Application Settings:**
   - In the application settings, you will find your `Client ID` and `Domain`.
   - Set the "Allowed Callback URLs" to `http://localhost:5173` (or your development URL).
   - Set the "Allowed Logout URLs" to `http://localhost:5173` (or your development URL).
   - Set the "Allowed Web Origins" to `http://localhost:5173` (or your development URL).

4. **Sample settings:**
   - The settings used by the demo deployment on GitHub Pages are:
     - Allowed Callback URLs: `https://sctg-development.github.io/vite-react-heroui-auth0-template`
     - Allowed Logout URLs: `https://sctg-development.github.io/vite-react-heroui-auth0-template`
     - Allowed Web Origins: `https://sctg-development.github.io`
     - On Github repository settings, the `AUTH0_CLIENT_ID` secret is set to the Auth0 client ID and the `AUTH0_DOMAIN` secret is set to the Auth0 domain.
     - The full Auth0 configuration screenshot is available [here](https://sctg-development.github.io/vite-react-heroui-auth0-template/auth0-settings.pdf).

### Environment Variables

To keep your Auth0 credentials secure, use environment variables. Create a `.env` file in the root of your project and add the following:

```env
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-secret
AUTH0_DOMAIN=your-auth0-domain
AUTH0_SCOPE="openid profile email read:api write:api"
AUTH0_AUDIENCE=https://myapi.example.com
API_BASE_URL=https://myapi.example.com/api
CORS_ORIGIN=https://your-github-username.github.io
READ_PERMISSION=read:api
WRITE_PERMISSION=write:api
ADMIN_PERMISSION=admin:api
```

### GitHub secrets

For using the provided GitHub Actions workflows, you need to add the following secrets to your repository:

```env
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-secret
AUTH0_DOMAIN=your-auth0-domain
AUTH0_SCOPE="openid profile email read:api write:api"
AUTH0_AUDIENCE=https://myapi.example.com
API_BASE_URL=https://myapi.example.com/api
CORS_ORIGIN=https://your-github-username.github.io
READ_PERMISSION=read:api
WRITE_PERMISSION=write:api
ADMIN_PERMISSION=admin:api
```

each secrets should be manually entered in Github like:
<img width="815" alt="image" src="https://github.com/user-attachments/assets/5543905d-6645-4c78-bbf0-715a33a796dd" />

### Authentication Route Guard

You can use the `AuthenticationGuard` component to protect routes that require authentication. This component works with any configured provider and will redirect users to the login page if they are not authenticated.

```tsx
import { AuthenticationGuard } from "./authentication";
<Route element={<AuthenticationGuard component={DocsPage} />} path="/docs" />;
```

### Secure API Calls

The template includes a fully-configured secure API call system that demonstrates how to communicate with protected backend services using Auth0 token authentication.

#### Auth0 API Configuration

To enable secure API calls in your application:

1. **Create an API in Auth0 Dashboard:**
   - Navigate to "APIs" section in the Auth0 dashboard
   - Click "Create API"
   - Provide a descriptive name (e.g., "My Application API")
   - Set the identifier (audience) - typically a URL or URI (e.g., `https://api.myapp.com`)
   - Configure the signing algorithm (RS256 recommended)

2. **Configure API Settings:**
   - Enable RBAC (Role-Based Access Control) if you need granular permission management
   - Define permissions (scopes) that represent specific actions (e.g., `read:api`, `write:api`)
   - Configure token settings as needed (expiration, etc.)
   - Include permissions in the access token

3. **Set Environment Variables:**
   Add the following to your `.env` file:

   ```env
   AUTH0_AUDIENCE=your-api-identifier
   AUTH0_SCOPE="openid profile email read:api write:api"
   API_BASE_URL=http://your-api-url.com
   ```

4. **Sample Configuration:**
   For reference, view the [Auth0 API configuration](https://sctg-development.github.io/vite-react-heroui-auth0-template/auth0-api.pdf) used in the demo deployment.

#### Making Secure API Calls

The template provides a hook `useSecuredApi` that handles token acquisition and authenticated requests for any configured provider:

```tsx
import { useSecuredApi } from "@/authentication";

// Inside your component:
const { getJson, postJson, deleteJson } = useSecuredApi();
// GET request to a secured API endpoint
const apiData = await getJson(`${import.meta.env.API_BASE_URL}/endpoint`);
// POST request to a secured API endpoint
const apiData = await postJson(`${import.meta.env.API_BASE_URL}/endpoint`, {
  data: "example",
});
// DELETE request to a secured API endpoint
const apiData = await deleteJson(`${import.meta.env.API_BASE_URL}/endpoint`);
```

This function automatically:

- Requests the appropriate token with configured audience and scope
- Attaches the token to the request header
- Handles errors appropriately
- Returns the JSON response

#### Using the Authentication API Directly

For more control, you can use the authentication provider API directly:

```tsx
import { useAuth } from "@/authentication";

// Inside your component:
const auth = useAuth();

// Access authentication state
const isLoggedIn = auth.isAuthenticated;
const userData = auth.user;

// Perform authentication actions
await auth.login();
await auth.logout();

// Get tokens for API calls
const token = await auth.getAccessToken();

// Make API calls
const data = await auth.getJson(`${import.meta.env.API_BASE_URL}/endpoint`);
await auth.postJson(`${import.meta.env.API_BASE_URL}/endpoint`, {
  key: "value",
});
```

This function automatically:

- Requests the appropriate token with configured audience and scope
- Attaches the token to the request header
- Handles errors appropriately
- Returns the JSON response

#### Checking Permissions

You can check user permissions with any configured authentication provider:

```tsx
import { useAuth } from "@/authentication";

// Inside your component:
const auth = useAuth();
const canReadData = await auth.hasPermission("read:api");

// Or using the useSecuredApi hook
import { useSecuredApi } from "@/authentication";

const { hasPermission } = useSecuredApi();
const canReadData = await hasPermission("read:api");
```

The permission system works across different providers, with each implementation handling the specific token format of that provider.

#### Protect a Component with a needed permission

This template includes a `AuthenticationGuardWithPermission` component that works with any configured provider and wraps a component to check if the user has the required permission:

```tsx
import { AuthenticationGuardWithPermission } from "@/authentication";

<AuthenticationGuardWithPermission permission="read:api">
  <ProtectedComponent />
</AuthenticationGuardWithPermission>;
```

#### Testing with Cloudflare Workers

For demonstration purposes, the template includes a Cloudflare Worker that acts as a secured backend API:

1. **Start the Worker with environment variables:**

```bash
# From the root directory
yarn dev:worker:env
```

2. **Test API Integration:**
   With both your application and the worker running, navigate to the `/api` route in your application to see the secure API call in action.

#### Understanding Token Flow

1. Your application requests an access token from Auth0 with specific audience and scope
2. Auth0 issues a JWT token containing the requested permissions
3. Your application includes this token in the Authorization header
4. The backend API validates the token using Auth0's public key
5. If valid, the API processes the request according to the permissions in the token

## Internationalization

This template uses i18next for internationalization. The configuration and available languages are defined in the `src/i18n.ts` file.

### Adding a New Language

To add a new language to the application, follow these steps:

1. **Update the `availableLanguages` array:**
   - Open the `src/i18n.ts` file.
   - Add a new object to the `availableLanguages` array with the following properties:
     - `code`: The ISO 639-1 language code (e.g., "en-US").
     - `nativeName`: The native name of the language (e.g., "English").
     - `isRTL`: Whether the language is right-to-left (e.g., `false`).

2. **Create a Translation File:**
   - In the `src/locales/base` directory, create a new JSON file named with the language code (e.g., `en-US.json`).
   - Add the translations for the new language in this file.

3. **Update the Load Path:**
   - In the `src/i18n.ts` file, manually add a switch case to the `loadPath` function to handle the new JSON file for the added language.

### Language Switch Component

The `LanguageSwitch` component allows users to switch between the available languages. It is defined in the `src/components/language-switch.tsx` file.

- The component uses the i18n instance to change the language and update the document metadata.
- It automatically updates the document direction based on the language (left-to-right or right-to-left).
- The selected language is stored in `localStorage` to persist the user's preference.

### Example Usage

To use the `LanguageSwitch` component in your application, simply include it in your JSX:

```tsx
<LanguageSwitch
  availableLanguages={[
    { code: "en-US", nativeName: "English", isRTL: false, isDefault: true },
    { code: "fr-FR", nativeName: "Français", isRTL: false },
  ]}
/>
```

or more simply using the `availableLanguages` array defined in the `src/i18n.ts` file:

```tsx
import { availableLanguages } from "@/i18n";
<LanguageSwitch availableLanguages={availableLanguages} />;
```

This component will render a dropdown menu with the available languages, allowing users to switch languages easily.

### Lazy Loading

The default configuration uses the `i18next-http-backend` plugin for language lazy loading. This means that translations are loaded only when needed, improving the application's performance.

### Summary

- **Configuration:** `src/i18n.ts`
- **Translations:** `src/locales/base`
- **Language Switch:** `src/components/language-switch.tsx`

By following the steps above, you can easily add new languages and manage internationalization for your application.

## Cookie Consent

This template includes a cookie consent management system to comply with privacy regulations like GDPR. The system displays a modal dialog asking users for consent to use cookies and stores their preference in the browser's localStorage.
<img width="944" alt="Capture d’écran 2025-04-11 à 19 55 13" src="https://github.com/user-attachments/assets/8769525c-bef0-4705-9b2e-6664aa68a9e0" />

### Features

- Modern modal-based UI with blur backdrop
- Internationalized content for all supported languages
- Stores user preferences in localStorage
- Provides a context API for checking consent status throughout the application
- Supports both accepting and rejecting cookies

### Configuration

The cookie consent feature can be enabled or disabled through the site configuration:

1. **Enable/Disable Cookie Consent:**
   - Open the `src/config/site.ts` file
   - Set the `needCookieConsent` property to `true` or `false`:

```typescript
export const siteConfig = () => ({
  needCookieConsent: true, // Set to false if you don't need cookie consent
  // ...other configuration
});
```

### Implementation Details

- **Context Provider:** `src/contexts/cookie-consent-context.tsx` - Provides a React context to manage consent state
- **UI Component:** `src/components/cookie-consent.tsx` - Renders the consent modal using HeroUI components
- **Consent Status:** The consent status can be one of three values:
  - `pending`: Initial state, user hasn't made a decision yet
  - `accepted`: User has accepted cookies
  - `rejected`: User has rejected cookies

### Using Cookie Consent in Your Components

You can access the cookie consent status in any component using the `useCookieConsent` hook:

```tsx
import { useCookieConsent } from "@/contexts/cookie-consent-context";

const MyComponent = () => {
  const { cookieConsent, acceptCookies, rejectCookies, resetCookieConsent } =
    useCookieConsent();

  // Load analytics only if cookies are accepted
  useEffect(() => {
    if (cookieConsent === "accepted") {
      // Initialize analytics, tracking scripts, etc.
    }
  }, [cookieConsent]);

  // ...rest of your component
};
```

### Customization

- Modify the appearance of the consent modal in `src/components/cookie-consent.tsx`
- Add custom tracking or cookie management logic in the `acceptCookies` and `rejectCookies` functions in `src/contexts/cookie-consent-context.tsx`
- Update the cookie policy text in the language files (e.g., `src/locales/base/en-US.json`)

## Project Structure

This template follows a monorepo structure managed by Turborepo with Yarn 4 workspaces, containing the frontend application and Cloudflare Worker.

```text
vite-react-heroui-auth0-template/
├── package.json                 # Root package.json with Turborepo + workspaces
├── turbo.json                   # Turborepo configuration
├── .yarnrc.yml                  # Yarn 4 configuration
├── yarn.lock                    # Unified lockfile for all packages
├── TURBOREPO-GUIDE.md          # Turborepo usage guide
├── apps/
│   ├── client/                  # Frontend application
│   │   ├── public/              # Static assets
│   │   ├── src/
│   │   │   ├── authentication/  # Authentication system
│   │   │   │   ├── auth-components.tsx # Authentication UI components
│   │   │   │   ├── auth-root.tsx    # Root authentication provider
│   │   │   │   ├── index.ts         # Exports
│   │   │   │   └── providers/       # Provider implementations
│   │   │   │       ├── auth-provider.ts  # Provider interface
│   │   │   │       ├── auth0-provider.tsx # Auth0 implementation
│   │   │   │       ├── dex-provider.tsx   # Dex implementation
│   │   │   │       └── use-auth.tsx       # Auth context and hooks
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── config/          # Configuration files
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   ├── layouts/         # Page layout components
│   │   │   ├── locales/         # Translation files
│   │   │   ├── pages/           # Page components
│   │   │   ├── styles/          # Global styles
│   │   │   ├── types/           # TypeScript definitions
│   │   │   ├── App.tsx          # Main application component
│   │   │   ├── i18n.ts          # i18next configuration
│   │   │   ├── main.tsx         # Application entry point
│   │   │   └── provider.tsx     # HeroUI provider setup
│   │   ├── tailwind.config.js   # Tailwind CSS configuration
│   │   ├── vite.config.ts       # Vite configuration
│   │   └── update-heroui.ts     # Helper script to update HeroUI packages
│   └── cloudflare-worker/       # Cloudflare Worker for testing API
│       ├── src/
│       ├── wrangler.jsonc       # Cloudflare Worker configuration
│       └── package.json         # Worker dependencies
├── .github/                     # GitHub workflows and configuration
├── .vscode/                     # VS Code configuration
└── template.code-workspace      # VS Code workspace configuration
```

## Available Scripts

This monorepo uses Turborepo for task orchestration. All scripts can be run from the root directory:

### Development Commands

```bash
# Start all applications in development mode
yarn dev

# Start all applications with environment variables
yarn dev:env

# Start only the client application
yarn dev:client

# Start only the client application with environment variables
yarn dev:client:env

# Start only the Cloudflare Worker
yarn dev:worker

# Start only the Cloudflare Worker with environment variables
yarn dev:worker:env
```

### Build Commands

```bash
# Build all applications
yarn build

# Build all applications with environment variables
yarn build:env

# Build only the client application
yarn build:client

# Build only the client with environment variables
yarn build:client:env

# Build only the Cloudflare Worker
yarn build:worker

# Build only the Cloudflare Worker with environment variables
yarn build:worker:env
```

### Other Commands

```bash
# Run ESLint on all packages
yarn lint

# Run type checking on all packages
yarn type-check

# Run tests on all packages
yarn test

# Clean all build artifacts and caches
yarn clean

# Deploy the Cloudflare Worker
yarn deploy:worker

# Update HeroUI packages (run from client directory)
cd apps/client && yarn update:heroui
```

For more detailed information, see the [Turborepo Guide](./TURBOREPO-GUIDE.md).

## Deployment

This template includes a GitHub Actions workflow to automatically deploy your application to GitHub Pages. To use this feature:

1. Enable GitHub Pages in the repository settings and set the source to GitHub Actions
2. Enable GitHub Actions in the repository settings
3. Add your Auth0 credentials as GitHub repository secrets:
   - `AUTH0_CLIENT_ID`
   - `AUTH0_DOMAIN`
4. Push the changes to your repository
5. The application will be deployed automatically on each push to the main branch

## Tailwind CSS 4

This template uses Tailwind CSS 4, which is a utility-first CSS framework. You can customize the styles by modifying the `tailwind.config.js` file.  
HeroUI supports Tailwind CSS 4 out of the box starting from version 2.8.

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/sctg-development/vite-react-heroui-auth0-template.git
```

### Install dependencies

This project uses Yarn 4 with workspaces. Install all dependencies from the root:

```bash
# Enable Yarn 4 if not already done
corepack enable
yarn set version 4.9.2

# Install all dependencies
yarn install
```

### Run the development server

```bash
# Start all applications with environment variables
yarn dev:env

# Or start individual applications
yarn dev:client:env  # Client only
yarn dev:worker:env  # Cloudflare Worker only
```

### Turborepo Benefits

This template uses Turborepo which provides:

- **Intelligent caching**: Build outputs are cached and shared across team members
- **Parallel execution**: Tasks run in parallel when possible
- **Dependency awareness**: Tasks run in the correct order based on dependencies
- **Incremental builds**: Only rebuild what changed
- **Remote caching**: Share build caches across your team (optional)

### Migration from npm to Turborepo

If you're migrating from the previous npm-based setup, here's the command mapping:

| Old npm command                                       | New Yarn command                   |
| ----------------------------------------------------- | ---------------------------------- |
| `cd client && npm run dev:env`                        | `yarn dev:client:env`              |
| `cd cloudflare-fake-secured-api && npm run dev:env`   | `yarn dev:worker:env`              |
| `cd client && npm run build:env`                      | `yarn build:client:env`            |
| `cd cloudflare-fake-secured-api && npm run build:env` | `yarn build:worker:env`            |
| `cd client && npm run lint`                           | `yarn lint` (runs on all packages) |

### Manual chunk splitting (frontend)

In the `apps/client/vite.config.ts` file, all `@heroui` packages are manually split into a separate chunk. This is done to reduce the size of the main bundle. You can remove this configuration if you don't want to split the packages.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This template is primarily licensed under the [MIT license](https://github.com/sctg-development/vite-react-heroui-auth0-template/blob/main/LICENSE).

**Exception:** Four specific files (`site-loading.tsx`, `language-switch.tsx`, `vite.config.ts`, and `auth0.tsx`) are licensed under the AGPL-3.0 license as they contain code originating from my other repositories.

## Authentication Architecture

The authentication system uses a provider-based architecture that allows you to easily switch between different OAuth providers:

### Authentication Provider Interface

All authentication providers implement a common interface that defines standard authentication methods:

```typescript
export interface AuthProvider {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;

  // Core authentication methods
  login(options?: LoginOptions): Promise<void>;
  logout(options?: LogoutOptions): Promise<void>;
  getAccessToken(options?: TokenOptions): Promise<string | null>;

  // Permission handling
  hasPermission(permission: string): Promise<boolean>;

  // API interaction helpers
  getJson(url: string): Promise<any>;
  postJson(url: string, data: any): Promise<any>;
  deleteJson(url: string): Promise<any>;
}
```

### Setting Up the Authentication Provider

To use the authentication system in your application, wrap your components with the `AuthenticationProvider`:

```tsx
import { AuthenticationProvider } from "./authentication";

// For Auth0 (default)
<AuthenticationProvider providerType="auth0">
  <App />
</AuthenticationProvider>

// For Dex
<AuthenticationProvider
  providerType="dex"
>
  <App />
</AuthenticationProvider>
```

### Auth0 Configuration

To use Auth0, follow these steps:

1. **Create an Auth0 Account:**
   - Go to [Auth0](https://auth0.com) and sign up for a free account.

2. **Create a New Application:**
   - In the Auth0 dashboard, navigate to the "Applications" section.
   - Click on "Create Application".
   - Choose a name for your application.
   - Select "Single Page Web Applications" as the application type.
   - Click "Create".

3. **Configure Application Settings:**
   - In the application settings, you will find your `Client ID` and `Domain`.
   - Set the "Allowed Callback URLs" to `http://localhost:5173` (or your development URL).
   - Set the "Allowed Logout URLs" to `http://localhost:5173` (or your development URL).
   - Set the "Allowed Web Origins" to `http://localhost:5173` (or your development URL).

4. **Sample settings:**
   - The settings used by the demo deployment on GitHub Pages are:
     - Allowed Callback URLs: `https://sctg-development.github.io/vite-react-heroui-auth0-template`
     - Allowed Logout URLs: `https://sctg-development.github.io/vite-react-heroui-auth0-template`
     - Allowed Web Origins: `https://sctg-development.github.io`
     - On Github repository settings, the `AUTH0_CLIENT_ID` secret is set to the Auth0 client ID and the `AUTH0_DOMAIN` secret is set to the Auth0 domain.
     - The full Auth0 configuration screenshot is available [here](https://sctg-development.github.io/vite-react-heroui-auth0-template/auth0-settings.pdf).

5. **Configure API in Auth0:**
   - Navigate to "APIs" section in the Auth0 dashboard
   - Click "Create API"
   - Provide a descriptive name (e.g., "My Application API")
   - Set the identifier (audience) - typically a URL or URI (e.g., `https://api.myapp.com`)
   - Configure the signing algorithm (RS256 recommended)

6. **Configure API Settings:**
   - Enable RBAC (Role-Based Access Control) if you need granular permission management
   - Define permissions (scopes) that represent specific actions (e.g., `read:api`, `write:api`)
   - Configure token settings as needed (expiration, etc.)
   - Include permissions in the access token

7. **Set Environment Variables:**
   Add the following to your `.env` file:

   ```env
   AUTHENTICATION_PROVIDER_TYPE=auth0
   AUTH0_AUDIENCE=your-api-identifier
   AUTH0_SCOPE="openid profile email read:api write:api"
   API_BASE_URL=http://your-api-url.com
   ```

8. **Sample Configuration:**
   For reference, view the [Auth0 API configuration](https://sctg-development.github.io/vite-react-heroui-auth0-template/auth0-api.pdf) used in the demo deployment.

### Dex Configuration

[Dex](https://dexidp.io/) is an identity service that uses OpenID Connect to drive authentication for other apps. To use Dex as your authentication provider:

1. **Setup a Dex Server:**
   - Install and configure a Dex server following the [official documentation](https://dexidp.io/docs/getting-started/)
   - Configure Dex to support the OAuth 2.0 authorization code flow

2. **Register your Application in Dex:**
   - Add your application to the Dex configuration
   - Set the redirect URI to your application's callback URL (e.g., `http://localhost:5173`)

3. **Configure the Dex Provider:**
   - Create a `.env` file with your Dex configuration:

   ```env
   AUTHENTICATION_PROVIDER_TYPE=dex
   DEX_AUTHORITY=https://your-dex-server.com
   DEX_CLIENT_ID=your-dex-client-id
   DEX_SCOPE="openid profile email"
   DEX_AUDIENCE=https://your-api.com
   DEX_JWKS_ENDPOINT=https://your-dex-server.com/dex/keys
   ```

4. **Initialize the Dex Provider:**

   ```tsx
   import { AuthenticationProvider } from "./authentication";

   <AuthenticationProvider providerType="dex">
     <App />
   </AuthenticationProvider>;
   ```

### Adding New Providers

To add support for additional OAuth providers:

1. Create a new provider implementation file in `src/authentication/providers/`
2. Implement the `AuthProvider` interface
3. Add the new provider to the `AuthProviderWrapper` in `src/authentication/providers/use-auth.tsx`
4. Add configuration in `src/authentication/auth-root.tsx`

The modular design makes it easy to extend the authentication system with new providers while maintaining a consistent API throughout your application.
