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

import { LinkUniversal } from "@/components/link-universal";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
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
        <div className="flex gap-3">
          <LinkUniversal  
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig().links.docs}
          >
            <Trans i18nKey="documentation" />
          </LinkUniversal>
          <LinkUniversal
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig().links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </LinkUniversal>
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
                <LinkUniversal
                  className={buttonStyles({
                    variant: "bordered",
                    radius: "full",
                  })}
                  href="/openapi"
                >
                  {t("openapi-docs")}
                </LinkUniversal>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <LinkUniversal
                  className={buttonStyles({
                    variant: "bordered",
                    radius: "full",
                  })}
                  href="/api"
                >
                  {t("api")}
                </LinkUniversal>
                <LinkUniversal
                  className={buttonStyles({
                    variant: "bordered",
                    radius: "full",
                  })}
                  href="/openapi"
                >
                  {t("openapi-docs")}
                </LinkUniversal>
              </div>
              <div className="mt-4">
                <LogoutButton text={t("log-out")} />
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              <Trans i18nKey="get-started-by-editing" />{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
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
