import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import "./i18n";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { CookieConsentProvider } from "./contexts/cookie-consent-context.tsx";
import { CookieConsent } from "./components/cookie-consent.tsx";
import { AuthenticationProvider } from "./authentication";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Provider>
        <CookieConsentProvider>
          <AuthenticationProvider
            providerType={
              import.meta.env.AUTHENTICATION_PROVIDER_TYPE || "auth0"
            }
          >
            <CookieConsent />
            <App />
          </AuthenticationProvider>
        </CookieConsentProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
