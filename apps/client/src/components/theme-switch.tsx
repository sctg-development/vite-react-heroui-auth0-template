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

import { FC, useState, useEffect } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/hooks/use-theme";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

const themes = [
  { key: "light", Icon: MoonFilledIcon, i18nKey: "switch-to-dark-mode" },
  { key: "dark", Icon: SunFilledIcon, i18nKey: "switch-to-light-mode" },
] as const;

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-6 h-6" />;

  const currentTheme = theme as "light" | "dark";

  return (
    <button
      aria-label={
        currentTheme === "light"
          ? t("switch-to-dark-mode")
          : t("switch-to-light-mode")
      }
      onClick={toggleTheme}
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-md p-2 transition-colors",
        "text-accent hover:text-accent-dark",
        className,
      )}
    >
      {themes.map(({ key, Icon }) => (
        <Icon
          key={key}
          className={clsx(
            "w-5 h-5 transition-all absolute",
            currentTheme === key
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none",
          )}
          aria-hidden="true"
        />
      ))}
    </button>
  );
};
