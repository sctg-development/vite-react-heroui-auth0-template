# Vite, Auth0 & HeroUI Template

This is a template for creating applications using Vite 6, HeroUI (v2) and an Auth0 authentication layer.

[Try it on CodeSandbox](https://githubbox.com/sctg-development/vite-react-heroui-auth0-template)

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

## Live demo
[<img width="1271" alt="demo" src="https://github.com/user-attachments/assets/f41f1fc3-ab50-40af-8ece-af4602812cc3" />](https://sctg-development.github.io/vite-react-heroui-auth0-template)

## Features

- 🚀 Fast development with Vite 6
- 🎨 Beautiful UI components from HeroUI v2
- 🔐 Authentication with Auth0
- 🌐 Internationalization with i18next (6 languages included)
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🧩 Type-safe with TypeScript
- 🧹 Code quality with ESLint 9
- 📦 Optimized build with manual chunk splitting

## Technologies Used

- [Vite 6](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [React 19](https://reactjs.org)
- [i18next](https://www.i18next.com)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [ESLint 9](https://eslint.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sctg-development/vite-react-heroui-auth0-template.git

# Change directory
cd vite-react-heroui-auth0-template/client

# Install dependencies
npm install && cd ../cloudflare-fake-secured-api && npm install

# Create a .env file with your Auth0 credentials
cat <<EOF > .env
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_DOMAIN=your-auth0-domain
AUTH0_SCOPE="openid profile email read:api write:api"
AUTH0_AUDIENCE=http://localhost:5173
API_BASE_URL=http://localhost:8787/api
CORS_ORIGIN=http://localhost:5173
READ_PERMISSION=read:api
EOF

# Start the development server
cd client && npm run dev:env &
# Start the Cloudflare Worker
cd cloudflare-fake-secured-api && npm run wrangler:env

```

## Table of Contents

- [Vite, Auth0 \& HeroUI Template](#vite-auth0--heroui-template)
  - [Star the project](#star-the-project)
  - [Live demo](#live-demo)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Quick Start](#quick-start)
  - [Table of Contents](#table-of-contents)
  - [Authentication with Auth0](#authentication-with-auth0)
    - [Setting Up Auth0](#setting-up-auth0)
    - [Environment Variables](#environment-variables)
    - [GitHub secrets](#github-secrets)
    - [Auth0 Route Guard](#auth0-route-guard)
    - [Secure API Calls](#secure-api-calls)
      - [Auth0 API Configuration](#auth0-api-configuration)
      - [Making Secure API Calls](#making-secure-api-calls)
      - [Testing with Cloudflare Workers](#testing-with-cloudflare-workers)
      - [Understanding Token Flow](#understanding-token-flow)
  - [Internationalization](#internationalization)
    - [Adding a New Language](#adding-a-new-language)
    - [Language Switch Component](#language-switch-component)
    - [Example Usage](#example-usage)
    - [Lazy Loading](#lazy-loading)
    - [Summary](#summary)
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

## Authentication with Auth0

This template uses the Auth0 React SDK to provide an authentication layer. Below are the steps to set up and configure Auth0 for this project.

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
```

each secrets should be manually entered in Github like:
<img width="815" alt="image" src="https://github.com/user-attachments/assets/5543905d-6645-4c78-bbf0-715a33a796dd" />

### Auth0 Route Guard

You can use the `AuthenticationGuard` component to protect routes that require authentication. This component will redirect users to the login page if they are not authenticated.

```tsx
import { AuthenticationGuard } from "./components/auth0";
<Route
          element={<AuthenticationGuard component={DocsPage} />}
          path="/docs"
        />
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

The template provides a utility function `getJsonFromSecuredApi` in `src/components/auth0.tsx` that handles token acquisition and authenticated requests:

```tsx
// Example usage in a component
import { getJsonFromSecuredApi } from "@/components/auth0";

// Inside your component:
const { getAccessTokenSilently } = useAuth0();
const apiData = await getJsonFromSecuredApi(
  `${import.meta.env.API_BASE_URL}/endpoint`,
  getAccessTokenSilently
);
```

This function automatically:

- Requests the appropriate token with configured audience and scope
- Attaches the token to the request header
- Handles errors appropriately
- Returns the JSON response

#### Testing with Cloudflare Workers

For demonstration purposes, the template includes a Cloudflare Worker that acts as a secured backend API:

1. **Deploy the Worker:**

```bash
cd cloudflare-fake-secured-api
npm install
cd ..
npm run wrangler
```

3. **Test API Integration:**
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
<LanguageSwitch availableLanguages={[{ code: "en-US", nativeName: "English", isRTL: false, isDefault: true },{ code: "fr-FR", nativeName: "Français", isRTL: false }]} />
```

or more simply using the `availableLanguages` array defined in the `src/i18n.ts` file:

```tsx
import { availableLanguages } from "@/i18n";
<LanguageSwitch availableLanguages={availableLanguages} />
```

This component will render a dropdown menu with the available languages, allowing users to switch languages easily.

### Lazy Loading

The default configuration uses the `i18next-http-backend` plugin for language lazy loading. This means that translations are loaded only when needed, improving the application's performance.

### Summary

- **Configuration:** `src/i18n.ts`
- **Translations:** `src/locales/base`
- **Language Switch:** `src/components/language-switch.tsx`

By following the steps above, you can easily add new languages and manage internationalization for your application.

## Project Structure

This template follows a mono-repository structure with the frontend application and Cloudflare Worker in separate directories.

```text
vite-react-heroui-auth0-template/
├──client                        # Frontend application
│   ├──public/                   # Static assets
│   ├──src/
│       ├── components/          # Reusable UI components
│       ├── config/              # Configuration files
│       ├── hooks/               # Custom React hooks
│       ├── layouts/             # Page layout components
│       ├── locales/             # Translation files
│       ├── pages/               # Page components
│       ├── styles/              # Global styles
│       ├── types/               # TypeScript definitions
│       ├── App.tsx              # Main application component
│       ├── i18n.ts              # i18next configuration
│       ├── main.tsx             # Application entry point
│       └── provider.tsx         # HeroUI provider setup
├── cloudflare-fake-secured-api/ # Cloudflare Worker for testing
├── .github/                     # GitHub workflows and configuration
├── .vscode/                     # VS Code configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
└── update-heroui.ts             # Helper script to update HeroUI packages
```

## Available Scripts in the frontend application

```bash
# Start the development server
npm run dev

# Start the development server with environment variables
npm run dev:env

# Run the Cloudflare Worker
npm run wrangler

# Build for production
npm run build

# Run ESLint to check and fix code
npm run lint

# Preview production build locally
npm run preview

# Update HeroUI packages to the latest beta
npm run update:heroui
```

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
Currently HeroUI uses Tailwind CSS 3, but [@winchesHe](https://github.com/winchesHe)  create a port of HeroUI to Tailwind CSS 4, you can find it [here](https://github.com/heroui-inc/heroui/pull/4656), HeroUI packages are available at <https://github.com/heroui-inc/heroui/pull/4656#issuecomment-2651218074>.

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/sctg-development/vite-react-heroui-auth0-template.git
```

### Manual chunk splitting (frontend)

In the `vite.config.ts` file, all `@heroui` packages are manually split into a separate chunk. This is done to reduce the size of the main bundle. You can remove this configuration if you don't want to split the packages.

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Run the Cloudflare Worker

```bash
npm run wrangler
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This template is primarily licensed under the [MIT license](https://github.com/sctg-development/vite-react-heroui-auth0-template/blob/main/LICENSE).

**Exception:** Four specific files (`site-loading.tsx`, `language-switch.tsx`, `vite.config.ts`, and `auth0.tsx`) are licensed under the AGPL-3.0 license as they contain code originating from my other repositories.
