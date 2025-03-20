# Vite & HeroUI Template

This is a template for creating applications using Vite 6, HeroUI (v2) and an Auth0 authentication layer.

[Try it on CodeSandbox](https://githubbox.com/sctg-development/vite-react-heroui-auth0-template)

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

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
cd vite-react-heroui-auth0-template

# Install dependencies
npm install

# Create a .env file with your Auth0 credentials
echo "AUTH0_CLIENT_ID=your-auth0-client-id\nAUTH0_DOMAIN=your-auth0-domain" > .env

# Start the development server
npm run dev
```

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
AUTH0_DOMAIN=your-auth0-domain
```

### GitHub secrets

For using the provided GitHub Actions workflows, you need to add the following secrets to your repository:

```env
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_DOMAIN=your-auth0-domain
```

### Auth0 Route Guard

You can use the `AuthenticationGuard` component to protect routes that require authentication. This component will redirect users to the login page if they are not authenticated.

```tsx
import { AuthenticationGuard } from "./components/auth0";
<Route
          element={<AuthenticationGuard component={DocsPage} />}
          path="/docs"
        />
```

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

```
vite-react-heroui-auth0-template/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layout components
│   ├── locales/          # Translation files
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript definitions
│   ├── App.tsx           # Main application component
│   ├── i18n.ts           # i18next configuration
│   ├── main.tsx          # Application entry point
│   └── provider.tsx      # HeroUI provider setup
├── .github/              # GitHub workflows and configuration
├── .vscode/              # VS Code configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── update-heroui.ts      # Helper script to update HeroUI packages
```

## Available Scripts

```bash
# Start the development server
npm run dev

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

### Manual chunk splitting

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
