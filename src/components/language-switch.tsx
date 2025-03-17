/**
 * @copyright Copyright (c) 2024-2025 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
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
import { type FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

import { availableLanguages } from "@/i18n";
import { I18nIcon } from "@/components/icons";

export const LanguageSwitch: FC = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    document.documentElement.lang = lng;
    document.title = t("vite-heroui");
    document.head
      .querySelector("meta[key='title']")
      ?.setAttribute("content", t("vite-heroui"));
    document.head
      .querySelector("meta[name='title']")
      ?.setAttribute("content", t("vite-heroui"));
  };

  /**
   * Get the short language code
   * @param lng
   * @returns
   */
  const getShortLanguage = (lng: string) => {
    // use the language code for Chinese
    if (lng.startsWith("zh")) {
      return "中文";
    }

    // use the first part of the language code
    return lng.split("-")[0];
  };

  return (
    <div className="flex gap-1">
      <Dropdown>
        <DropdownTrigger>
          <Button aria-label={t("language")} variant="light">
            <I18nIcon className="text-default-500" size={24} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {availableLanguages.map((lng) => (
            <DropdownItem key={lng} aria-label={`${t("language")}: ${lng}`}>
              <button
                key={lng}
                className={`${language === lng ? "text-primary" : "text-default-600"} w-full`}
                type="button"
                onClick={() => changeLanguage(lng)}
              >
                {getShortLanguage(lng).toLocaleUpperCase()}
              </button>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
