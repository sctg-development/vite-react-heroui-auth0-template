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

import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import { useClipboard } from "@heroui/use-clipboard";
import { Button, type ButtonProps } from "@heroui/button";
import { clsx } from "@heroui/shared-utils";

import { IconSvgProps } from "@/types";

export interface PreviewButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

export const PreviewButton = forwardRef<
  HTMLButtonElement | null,
  PreviewButtonProps
>((props, ref) => {
  const { icon, className, ...buttonProps } = props;

  return (
    <Button
      ref={ref}
      isIconOnly
      className={clsx("relative z-50 text-zinc-300", className)}
      size="sm"
      variant={props.variant ?? "light"}
      {...buttonProps}
    >
      {icon}
    </Button>
  );
});

PreviewButton.displayName = "PreviewButton";

export interface CopyButtonProps extends Omit<ButtonProps, "value"> {
  value?: string | string[];
  copiedTimeout?: number;
  showToast?: boolean;
  toastText?: string;
  onCopySuccess?: () => void;
  onCopyError?: (error: unknown) => void;
  isImage?: boolean;
}

export const CopyButton = memo<CopyButtonProps>(
  ({
    value,
    className,
    copiedTimeout = 2000,
    onCopySuccess,
    onCopyError,
    isImage = false,
    ...buttonProps
  }) => {
    const { copy, copied } = useClipboard();
    const [hasCopyError, setHasCopyError] = useState(false);

    useEffect(() => {
      if (hasCopyError) {
        const timer = setTimeout(() => setHasCopyError(false), copiedTimeout);

        return () => clearTimeout(timer);
      }
    }, [hasCopyError, copiedTimeout]);

    const handleCopy = useCallback(() => {
      if (!isImage) {
        const textToCopy = Array.isArray(value) ? value.join(", ") : value;

        try {
          copy(textToCopy);
          if (onCopySuccess) onCopySuccess();
        } catch (error) {
          setHasCopyError(true);
          if (onCopyError) onCopyError(error);
        }
      }
    }, [value, copy, onCopySuccess, onCopyError, isImage]);

    const isCopied = copied;

    const icon = hasCopyError ? (
      <ErrorIcon
        className="opacity-0 scale-50 text-danger data-[visible=true]:opacity-100 data-[visible=true]:scale-100 transition-transform-opacity"
        data-visible={hasCopyError}
        size={16}
      />
    ) : isCopied ? (
      <CheckLinearIcon
        className="opacity-0 scale-50 text-success data-[visible=true]:opacity-100 data-[visible=true]:scale-100 transition-transform-opacity"
        data-visible={isCopied}
        size={16}
      />
    ) : (
      <CopyLinearIcon
        className="opacity-0 scale-50 data-[visible=true]:opacity-100 data-[visible=true]:scale-100 transition-transform-opacity"
        data-visible={!isCopied && !hasCopyError}
        size={16}
      />
    );

    return (
      <PreviewButton
        aria-label={isCopied ? "Copié" : "Copier dans le presse-papier"}
        className={className ?? "bottom-0 left-0.5"}
        icon={icon}
        title={isCopied ? "Copié" : "Copier dans le presse-papier"}
        onPress={handleCopy}
        {...buttonProps}
      />
    );
  },
);

CopyButton.displayName = "CopyButton";

export const CopyLinearIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export const CheckLinearIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ErrorIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M15 9L9 15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M9 9L15 15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);
