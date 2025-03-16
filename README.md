# Vite & HeroUI Template

This is a template for creating applications using Vite 6 and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/sctg-development/vite-react-heroui-template)

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

## Technologies Used

- [Vite 6](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [React 19](https://reactjs.org)
- [i18next](https://www.i18next.com)
- [ESLint 9](https://eslint.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## Internationalization

This template uses i18next for internationalization. You can find the translations in the `src/locales` folder.  
The `base`subfolder is the default namespace.  
For adding a new language, create a new file in the `src/locales/base` folder and add the translations in the `language-code.json` file.  
Next you will need to add the language to the `i18n.ts` file.  
The default configuration uses language lazy loading with `i18next-http-backend`, so the translations are loaded only when needed.  

## Tailwind CSS 4

This template uses Tailwind CSS 4, which is a utility-first CSS framework. You can customize the styles by modifying the `tailwind.config.js` file.  
Currently HeroUI uses Tailwind CSS 3, but [@winchesHe](https://github.com/winchesHe)  create a port of HeroUI to Tailwind CSS 4, you can find it [here](https://github.com/heroui-inc/heroui/pull/4656), HeroUI packages are available at <https://github.com/heroui-inc/heroui/pull/4656#issuecomment-2651218074>.

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/sctg-development/vite-react-heroui-template.git
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

## License

Licensed under the [MIT license](https://github.com/sctg-development/vite-react-heroui-template/blob/main/LICENSE).
