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

import { useTranslation } from "react-i18next";

import { LinkUniversal } from "./link-universal";
import { LanguageSwitch } from "./language-switch";

import { LoginLogoutButton } from "@/authentication";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { availableLanguages } from "@/i18n";

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-default-100 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-4">
          <LinkUniversal
            className="flex items-center gap-1 text-current"
            href="/"
          >
            <Logo />
            <p className="font-bold">ACME</p>
          </LinkUniversal>
          <div className="hidden lg:flex items-center gap-3">
            {siteConfig().navItems.map((item) => (
              <LinkUniversal
                key={item.href}
                className="text-default-800 hover:text-accent transition-colors"
                href={item.href}
              >
                {item.label}
              </LinkUniversal>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <LinkUniversal
            isExternal
            isInternet
            href={siteConfig().links.twitter}
            title={t("twitter")}
            className="text-default-500 hover:text-accent"
          >
            <TwitterIcon />
          </LinkUniversal>
          <LinkUniversal
            isExternal
            isInternet
            href={siteConfig().links.discord}
            title={t("discord")}
            className="text-default-500 hover:text-accent"
          >
            <DiscordIcon />
          </LinkUniversal>
          <LinkUniversal
            isExternal
            isInternet
            href={siteConfig().links.github}
            title={t("github")}
            className="text-default-500 hover:text-accent"
          >
            <GithubIcon />
          </LinkUniversal>
          <ThemeSwitch />
          <LanguageSwitch availableLanguages={availableLanguages} />
          <LoginLogoutButton />
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <LinkUniversal isExternal isInternet href={siteConfig().links.github}>
            <GithubIcon />
          </LinkUniversal>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
};
