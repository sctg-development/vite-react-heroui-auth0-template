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
import React from "react";
import { Link } from "@heroui/react";
import { Trans, useTranslation } from "react-i18next";

import { useCookieConsent } from "../contexts/cookie-consent-context";

import { buttonGradient } from "./primitives";

import { siteConfig } from "@/config/site";

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const { cookieConsent, acceptCookies, rejectCookies } = useCookieConsent();

  // État pour contrôler la visibilité du modal
  const isOpen = cookieConsent === "pending" && siteConfig().needCookieConsent;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl">
        <div className="text-lg font-semibold text-default-900">
          {t("cookie-consent-title")}
        </div>
        <div className="mt-2 text-sm font-normal text-default-700">
          <Trans i18nKey="cookie-consent" t={t} />
          &nbsp;
          <Link className="text-sm" href="#">
            {t("cookie-policy")}
          </Link>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <div className="mt-4 flex items-center gap-x-1">
            <Button
              className={buttonGradient({ bordered: "violet" })}
              onPress={acceptCookies}
            >
              {t("accept-all")}
            </Button>
            <Button
              className="rounded-lg border border-accent"
              variant="secondary"
              onPress={rejectCookies}
            >
              {t("reject")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
