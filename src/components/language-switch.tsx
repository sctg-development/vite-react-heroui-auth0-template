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
import { type FC, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { availableLanguages } from "@/i18n";
import { I18nIcon } from "@/components/icons";

/**
 * Language switch component
 * @description
 * A language switch component that allows users to change the language of the application
 * It uses the i18n instance to change the language and update the document metadata
 * Available languages are defined in the i18n configuration (src/i18n.ts)
 * @example
 * ```tsx
 * <LanguageSwitch />
 * ```
 */
export const LanguageSwitch: FC = () => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("preferredLanguage") || i18n.language,
  );

  /**
   * Update document direction based on language
   * @description
   * This effect updates the document direction based on the language
   * It uses the availableLanguages array to determine the language direction
   * @see availableLanguages
   */
  useEffect(() => {
    const isRTL =
      availableLanguages.find((lang) => lang.code === language)?.isRTL || false;

    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language]);

  // Sync state with i18n when language changes externally
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  /**
   * Change the language and update document metadata
   * @param lng The language code
   * @example changeLanguage("fr-FR")
   */
  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      setLanguage(lng);
      localStorage.setItem("preferredLanguage", lng);
      document.documentElement.lang = lng;

      // Update metadata
      document.title = t("vite-heroui");
      const metaTags = [
        document.head.querySelector("meta[key='title']"),
        document.head.querySelector("meta[name='title']"),
        document.head.querySelector("meta[property='og:title']"),
      ];

      metaTags.forEach((tag) => {
        tag?.setAttribute("content", t("vite-heroui"));
      });
    },
    [i18n, t],
  );

  /**
   * Get the short language code from the language code
   * erases the region part of the language code
   * @param lng
   * @returns The short language code
   * @example getShortLanguage("fr-FR") => "FR"
   */
  const getShortLanguage = (lng: string) => {
    // use the last part of the language code or the whole code
    return lng.split("-")[1] || lng;
  };

  return (
    <Tooltip content={t("language")} delay={750}>
      <div className="flex gap-1">
        <Dropdown>
          <DropdownTrigger>
            <Button aria-label={t("language")} variant="light">
              <I18nIcon className="text-default-500" size={24} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label={t("language")}>
            {availableLanguages.map((languageIdentifier) => {
              // Construct the language switch component with the language code
              const isSelected = language === languageIdentifier.code;

              return (
                <DropdownItem
                  key={languageIdentifier.code}
                  aria-label={`${t("language")}: ${languageIdentifier}`}
                  aria-selected={isSelected}
                >
                  <button
                    key={languageIdentifier.code}
                    className={`${isSelected ? "text-primary" : "text-default-600"} w-full flex items-center justify-between`}
                    type="button"
                    onClick={() => changeLanguage(languageIdentifier.code)}
                  >
                    <span>{languageIdentifier.nativeName}</span>
                    <span>
                      {getShortLanguage(
                        languageIdentifier.code,
                      ).toLocaleUpperCase()}
                    </span>
                  </button>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    </Tooltip>
  );
};
