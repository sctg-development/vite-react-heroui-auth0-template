import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nextHttpBackend, {
  type HttpBackendOptions,
} from "i18next-http-backend";

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
export const availableLanguages = ["en-US", "fr-FR", "es-ES", "zh-CN"];
