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

import { SiteLoading } from "./components/site-loading";
import { PageNotFound } from "./pages/404";
import { AuthenticationGuard, useAuth } from "./authentication";

import IndexPage from "@/pages/index";
import ApiPage from "@/pages/api";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import UsersAndPermissionsPage from "@/pages/admin/users-and-permissions";
import { SwaggerPage } from "@/pages/swagger";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <SiteLoading />;
  }

  // Gérer les erreurs
  // Note: we no longer block the whole app when the user is unauthenticated.
  // Individual routes that require auth use <AuthenticationGuard> instead.
  // The landing page should be accessible to everyone, otherwise GitHub
  // Pages visitors just see an "authentication error" message.

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
        <Route
          element={<AuthenticationGuard component={UsersAndPermissionsPage} />}
          path="/admin/users"
        />
        <Route
          element={<AuthenticationGuard component={SwaggerPage} />}
          path="/openapi"
        />
        <Route element={<PageNotFound />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default App;
