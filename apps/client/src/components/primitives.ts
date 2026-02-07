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

import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl leading-9",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

export const buttonGradient = tv({
  base: [
    "group relative inline-flex items-center justify-center",
    "box-border appearance-none select-none whitespace-nowrap",
    "subpixel-antialiased overflow-hidden tap-highlight-transparent",
    "data-[pressed=true]:scale-[0.97] outline-none",
    "data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2",
    "data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2",
    "min-w-20 h-10 text-small gap-2 rounded-large",
    "[&>svg]:max-w-[theme(spacing.8)]",
    "transition-transform-colors-opacity motion-reduce:transition-none",
    "bg-transparent text-default-foreground data-[hover=true]:opacity-hover",
    "px-4 font-medium",
  ],
  variants: {
    bordered: {
      true: "border-2",
      violet: [
        "[background-clip:padding-box,border-box]",
        "border-2",
        "border-transparent",
        "bg-gradient-border-violet",
        "bg-origin-border",
      ],
    },
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "min-w-16 h-8 text-xs px-3",
      md: "min-w-20 h-10 text-small px-4",
      lg: "min-w-24 h-12 text-medium px-6",
    },
  },
  defaultVariants: {
    bordered: "violet",
    size: "md",
  },
});
