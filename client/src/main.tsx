import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App.tsx";
import "./i18n";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Provider>
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
          <App />
        </Auth0Provider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
