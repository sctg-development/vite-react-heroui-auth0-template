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

import { Button } from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

import { useAuth } from "@/authentication";
import { LoginButton, LogoutButton } from "@/authentication";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>{t("make")}&nbsp;</span>
          <span className={title({ color: "violet" })}>
            {t("beautiful")}&nbsp;
          </span>
          <br />
          <span className={title()}>
            <Trans i18nKey="websites-regardless-of-your-design-experience" />
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            <Trans i18nKey="beautiful-fast-and-modern-react-ui-library" />
          </div>
        </div>

        {/* call-to-action buttons */}
        <div className="flex gap-3 items-center">
          <a href={siteConfig().links.docs} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full">
              <Trans i18nKey="documentation" />
            </Button>
          </a>
          <a href={siteConfig().links.github} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full" variant="outline">
              <GithubIcon size={20} />
              GitHub
            </Button>
          </a>
        </div>

        {/* dynamic area depending on auth state */}
        <div className="mt-8 text-center">
          {!isAuthenticated ? (
            <>
              <LoginButton />
              <p className="mt-4 text-sm">
                <Trans i18nKey="template_login_prompt" />
              </p>
              <div className="mt-2">
                <RouterLink to="/openapi">
                  <Button className="rounded-full" variant="outline">
                    {t("openapi-docs")}
                  </Button>
                </RouterLink>
                <p className="text-xs mt-1 opacity-70">
                  <Trans i18nKey="template_login_required" />
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                <Trans
                  i18nKey="template_welcome_back"
                  values={{ name: user?.nickname || user?.name }}
                />
              </p>
              <div className="flex flex-row gap-3 justify-center mt-4">
                <RouterLink to="/api">
                  <Button className="rounded-full" variant="outline">
                    {t("api")}
                  </Button>
                </RouterLink>
                <RouterLink to="/openapi">
                  <Button className="rounded-full" variant="outline">
                    {t("openapi-docs")}
                  </Button>
                </RouterLink>
              </div>
              <div className="mt-4">
                <LogoutButton text={t("log-out")} />
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <div className="rounded-lg border border-default-200 bg-default-100 p-3">
            <span>
              <Trans i18nKey="get-started-by-editing" />{" "}
              <code className="font-mono text-primary">pages/index.tsx</code>
            </span>
          </div>
          <p className="text-xs mt-2">
            <Trans i18nKey="template_clone_instructions">
              Clone this repo, edit <code>.env</code> and run{" "}
              <code>yarn install && yarn dev:env</code> to get started.
            </Trans>
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
