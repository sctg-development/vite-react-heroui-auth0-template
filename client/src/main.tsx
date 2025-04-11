import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App.tsx";
import "./i18n";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { CookieConsentProvider } from "./contexts/cookie-consent-context.tsx";
import { CookieConsent } from "./components/cookie-consent.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Provider>
        <CookieConsentProvider>
          <Auth0Provider
            authorizationParams={{
              redirect_uri: new URL(
                import.meta.env.BASE_URL || "/",
                window.location.origin,
              ).toString(),
              audience: import.meta.env.AUTH0_AUDIENCE,
              scope: import.meta.env.AUTH0_SCOPE,
            }}
            clientId={import.meta.env.AUTH0_CLIENT_ID}
            domain={import.meta.env.AUTH0_DOMAIN}
          >
            <CookieConsent />
            <App />
          </Auth0Provider>
        </CookieConsentProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
