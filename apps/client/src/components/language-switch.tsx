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
import { type FC, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Tooltip, Label } from "@heroui/react";

import { type AvailableLanguage } from "@/i18n";
import { type IconSvgProps } from "@/types";

/** Globe / translate icon — default trigger for {@link LanguageSwitch}. */
export const I18nIcon: FC<IconSvgProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    height={size || height}
    viewBox="0 0 1024 1024"
    width={size || width}
    {...props}
  >
    <path
      d="M547.797333 638.208l-104.405333-103.168 1.237333-1.28a720.170667 720.170667 0 0 0 152.490667-268.373333h120.448V183.082667h-287.744V100.906667H347.605333v82.218666H59.818667V265.386667h459.178666a648.234667 648.234667 0 0 1-130.304 219.946666 643.242667 643.242667 0 0 1-94.976-137.728H211.541333a722.048 722.048 0 0 0 122.453334 187.434667l-209.194667 206.378667 58.368 58.368 205.525333-205.525334 127.872 127.829334 31.232-83.84m231.424-208.426667h-82.218666l-184.96 493.312h82.218666l46.037334-123.306667h195.242666l46.464 123.306667h82.218667l-185.002667-493.312m-107.690666 287.744l66.56-178.005333 66.602666 178.005333z"
      fill="currentColor"
    />
  </svg>
);

interface LanguageSwitchProps {
  availableLanguages?: AvailableLanguage[];
  icon?: FC<IconSvgProps>;
}

export const LanguageSwitch: FC<LanguageSwitchProps> = ({
  availableLanguages = [
    { code: "en-US", nativeName: "English", isRTL: false, isDefault: true },
  ],
  icon: Icon = I18nIcon,
}) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("preferredLanguage") || i18n.language,
  );

  useEffect(() => {
    const isRTL =
      availableLanguages.find((lang) => lang.code === language)?.isRTL || false;

    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      setLanguage(lng);
      localStorage.setItem("preferredLanguage", lng);
      document.documentElement.lang = lng;

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

  const getShortLanguage = (lng: string) => lng.split("-")[1] || lng;

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div className="flex gap-1">
          <Dropdown>
            <Dropdown.Trigger aria-label={t("language")}>
              <Icon className="text-accent hover:text-accent-dark transition-colors" size={24} />
            </Dropdown.Trigger>
            <Dropdown.Popover>
              <Dropdown.Menu aria-label={t("language")}>
                {availableLanguages.map((languageIdentifier) => {
                  const isSelected = language === languageIdentifier.code;

                  return (
                    <Dropdown.Item
                      key={languageIdentifier.code}
                      id={languageIdentifier.code}
                      textValue={languageIdentifier.nativeName}
                      aria-label={`${t("language")}: ${languageIdentifier.nativeName}`}
                      aria-selected={isSelected}
                      onPress={() => changeLanguage(languageIdentifier.code)}
                      className={isSelected ? "text-primary" : "text-default-600"}
                    >
                      <Label className="w-full flex items-center justify-between">
                        <span>{languageIdentifier.nativeName}</span>
                        <span>{getShortLanguage(languageIdentifier.code).toLocaleUpperCase()}</span>
                      </Label>
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {t("language")}
      </Tooltip.Content>
    </Tooltip>
  );
};
