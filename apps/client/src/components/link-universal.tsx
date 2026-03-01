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
import type { LinkProps } from "@heroui/link";

import { forwardRef } from "react";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import { clsx } from "@heroui/shared-utils";

type LinkUniversalProps = Omit<LinkProps, "as"> & {
  /**
   * If true, renders as a native <a> tag with HeroUI Link styles applied.
   * If false or undefined, renders as HeroUI <Link> component (supports react-router).
   * @default false
   */
  isInternet?: boolean;
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
      color,
      size,
      underline,
      isDisabled,
      disableAnimation,
      isExternal,
      showAnchorIcon,
      anchorIcon,
      ...props
    },
    ref,
  ) => {
    // If not an internet link, use HeroUI Link component (supports react-router)
    if (!isInternet) {
      return (
        <Link
          ref={ref}
          anchorIcon={anchorIcon}
          className={className}
          color={color}
          disableAnimation={disableAnimation}
          href={href}
          isDisabled={isDisabled}
          isExternal={isExternal}
          showAnchorIcon={showAnchorIcon}
          size={size}
          underline={underline}
          {...props}
        >
          {children}
        </Link>
      );
    }

    // For internet links, create a native <a> with HeroUI Link styles applied
    const styledClassName = clsx(
      linkStyles({
        color: color as any,
        size: size as any,
        underline: underline as any,
        isDisabled: isDisabled as any,
        disableAnimation: disableAnimation as any,
      }),
      className,
    );

    return (
      <a
        ref={ref}
        aria-disabled={isDisabled}
        className={styledClassName}
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
        {...props}
      >
        {children}
        {showAnchorIcon && anchorIcon}
      </a>
    );
  },
);

LinkUniversal.displayName = "LinkUniversal";
