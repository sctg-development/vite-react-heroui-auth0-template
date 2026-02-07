/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { SiteLoading } from "./components/site-loading";
import DefaultLayout from "./layouts/default";
import { title } from "./components/primitives";
import { PageNotFound } from "./pages/404";
import { AuthenticationGuard, LogoutButton, useAuth } from "./authentication";

import IndexPage from "@/pages/index";
import ApiPage from "@/pages/api";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return <SiteLoading />;
  }

  // Gérer les erreurs
  if (!isAuthenticated && !isLoading) {
    // eslint-disable-next-line no-console
    console.log(
      "User is not authenticated but auth is not loading - likely an error condition",
    );

    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <div className="mb-4">
              <h1 className={title()}>
                {t("error")}: {t("authentication_error")}
              </h1>
            </div>
            <div>
              <LogoutButton
                showButtonIfNotAuthenticated={true}
                text={t("reload")}
              />
            </div>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <Suspense fallback={<SiteLoading />}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route
          element={<AuthenticationGuard component={ApiPage} />}
          path="/api"
        />
        <Route
          element={<AuthenticationGuard component={PricingPage} />}
          path="/pricing"
        />
        <Route
          element={<AuthenticationGuard component={BlogPage} />}
          path="/blog"
        />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default App;
