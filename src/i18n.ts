/**
 * i18n configuration
 * @description
 * This file configures the i18n instance with the following settings:
 *  * The default language is English (en-US)
 *  * The available languages are defined in the availableLanguages array
 *  * The i18n instance is initialized with the i18next-http-backend plugin
 *  * The i18n instance is exported as the default export
 * How to add a new language ?
 *  * Add a new object to the availableLanguages array with the following properties:
 *    * code: The ISO 639-1 language code (e.g., "en-US")
 *    * nativeName: The native name of the language (e.g., "English")
 *    * isRTL: Whether the language is right-to-left (e.g., false)
 *  * Create a new JSON file in the locales/{namespace} directory with the language code (e.g., "en-US.json")
 *  * Manually add a switch case to the loadPath function in the i18n configuration to load the new JSON file
 *  * The new language should now be available for selection in the LanguageSwitch component
 * @see src/components/language-switch.tsx
 * @see src/locales/base/en-US.json
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nextHttpBackend, {
  type HttpBackendOptions,
} from "i18next-http-backend";

export interface AvailableLanguage {
  code: string; // ISO 639-1 language code
  nativeName: string; // Native name of the language
  isRTL: boolean; // Right-to-left language
}

export const availableLanguages: AvailableLanguage[] = [
  { code: "en-US", nativeName: "English", isRTL: false },
  { code: "fr-FR", nativeName: "Français", isRTL: false },
  { code: "es-ES", nativeName: "Español", isRTL: false },
  { code: "zh-CN", nativeName: "中文", isRTL: false },
  { code: "ar-SA", nativeName: "العربية", isRTL: true },
  { code: "he-IL", nativeName: "עברית", isRTL: true },
];

i18n
  .use(i18nextHttpBackend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init<HttpBackendOptions>({
    lng: "en-US",
    fallbackLng: "en-US",
    ns: ["base"],
    defaultNS: "base",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p", "sub", "sup"],
    },
    backend: {
      loadPath: (lng, ns) => {
        let url: URL = new URL("./locales/base/en-US.json", import.meta.url);

        // Vite does not know how to resolve
        // new URL(`./locales/${ns}/${reqlng}.json`, import.meta.url)
        // so we need to manually handle the different namespaces and languages
        switch (ns[0]) {
          case "base":
            switch (lng[0]) {
              case "en-US":
                url = new URL("./locales/base/en-US.json", import.meta.url);
                break;
              case "fr-FR":
                url = new URL("./locales/base/fr-FR.json", import.meta.url);
                break;
              case "es-ES":
                url = new URL("./locales/base/es-ES.json", import.meta.url);
                break;
              case "zh-CN":
                url = new URL("./locales/base/zh-CN.json", import.meta.url);
                break;
              case "ar-SA":
                url = new URL("./locales/base/ar-SA.json", import.meta.url);
                break;
              case "he-IL":
                url = new URL("./locales/base/he-IL.json", import.meta.url);
                break;
              default:
                url = new URL("./locales/base/en-US.json", import.meta.url);
            }
            break;
          default:
            url = new URL("./locales/base/en-US.json", import.meta.url);
        }

        return url.toString();
      },
    },
  });

export default i18n;
