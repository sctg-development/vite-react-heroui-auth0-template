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

import type { ReactNode } from "react";
import type { LinkProps } from "@heroui/react";

import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";

type LinkUniversalProps = Omit<LinkProps, "as"> & {
  /**
   * If true, renders as a native <a> tag with standard styling.
   * If false or undefined, renders as react-router <Link>.
   * @default false
   */
  isInternet?: boolean;
  /**
   * Marks the link as external and sets relay attributes.
   */
  isExternal?: boolean;
  /**
   * Show link icon (deprecated for v3, pass children Link.Icon instead)
   */
  showAnchorIcon?: boolean;
  anchorIcon?: ReactNode;
  title?: string;
  /**
   * Children content of the link
   */
  children?: ReactNode;
};

/**
 * LinkUniversal is a polymorphic link component that intelligently chooses
 * between HeroUI's <Link> component (for internal/react-router navigation)
 * and a native <a> tag (for external internet links).
 *
 * This wrapper solves the issue where HeroUI Link 2.2.25 has limited support
 * for react-router integration, allowing seamless switching between routing modes.
 *
 * @example
 * // Use HeroUI Link for internal routes
 * <LinkUniversal href="/about" color="primary">About</LinkUniversal>
 *
 * @example
 * // Use native <a> tag for external links
 * <LinkUniversal href="https://example.com" isInternet color="primary">External</LinkUniversal>
 */
export const LinkUniversal = forwardRef<HTMLAnchorElement, LinkUniversalProps>(
  (
    {
      isInternet = false,
      children,
      className,
      href,
      title,
      isDisabled,
      isExternal,
      showAnchorIcon,
      anchorIcon,
      ...props
    },
    ref,
  ) => {
    // decide whether to render an internal router link or external/internet link
    const styledClassName = clsx(
      "text-accent hover:text-accent-dark transition-colors",
      isDisabled ? "opacity-50 pointer-events-none" : "",
      className,
    );

    if (!isInternet) {
      // use react-router-dom Link for internal navigation
      // href is expected to be a string path
      return (
        <RouterLink
          ref={ref as any}
          to={href || ""}
          className={styledClassName}
          aria-disabled={isDisabled}
          title={title}
          {...(props as any)}
        >
          {children}
          {showAnchorIcon && anchorIcon}
        </RouterLink>
      );
    }

    // For internet links, render native <a> with same styling
    return (
      <a
        ref={ref}
        aria-disabled={isDisabled}
        className={styledClassName}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        title={title}
        {...(props as any)}
      >
        {children}
        {showAnchorIcon && anchorIcon}
      </a>
    );
  },
);

LinkUniversal.displayName = "LinkUniversal";
