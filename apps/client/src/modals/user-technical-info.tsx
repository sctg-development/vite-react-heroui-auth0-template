/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * Modal component displaying technical user/token information.
 * Shown in the bottom-right corner on desktop, centered on mobile.
 */

import { memo, useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { JWTPayload } from "jose";
import { useTranslation } from "react-i18next";
import { CopyButton } from "@/components/copy-button";
import { AuthenticationGuardWithPermission } from "@/authentication";
import { useNavigate } from "react-router-dom";
import { User } from "@auth0/auth0-react";

interface UserTechnicalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    accessToken: string | null;
    tokenPayload: JWTPayload | null;
}

function formatExpiry(exp: number): string {
    return new Date(exp * 1000).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getSecondsLeft(exp: number): number {
    return Math.max(0, Math.floor(exp - Date.now() / 1000));
}

function formatDuration(seconds: number, t: any): string {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hms = [hours, minutes, secs]
        .map((v) => v.toString().padStart(2, "0"))
        .join(":");

    if (days > 0) {
        return `${t("duration-day", { count: days })} ${hms}`;
    }
    return hms;
}

export const UserTechnicalInfoModal = memo<UserTechnicalInfoModalProps>(
    ({ isOpen, onClose, user, accessToken, tokenPayload }) => {
        const { t } = useTranslation();
        const navigate = useNavigate();
        const [secondsLeft, setSecondsLeft] = useState<number>(0);

        useEffect(() => {
            if (!tokenPayload?.exp) return;
            setSecondsLeft(getSecondsLeft(tokenPayload.exp));
            const interval = setInterval(() => {
                setSecondsLeft(getSecondsLeft(tokenPayload.exp!));
            }, 1000);
            return () => clearInterval(interval);
        }, [tokenPayload?.exp]);

        const permissions = (tokenPayload?.permissions as string[] | undefined) ?? [];
        const isExpiringSoon = secondsLeft < 120;

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                placement="auto"
                classNames={{
                    wrapper: "sm:items-end sm:justify-end sm:p-4",
                    base: "sm:m-0 sm:max-w-[400px] bg-content1 border border-default-100 shadow-2xl",
                    header: "border-b border-default-100 pb-3",
                    body: "px-5 py-4",
                }}
                motionProps={{
                    variants: {
                        enter: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                        exit: { opacity: 0, y: 16, transition: { duration: 0.15 } },
                    },
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-black text-foreground text-base leading-tight">
                                {t("nav-user-dropdown-connected-as")}
                            </span>
                            <span className="text-sm font-semibold text-primary truncate max-w-[300px]">
                                {user.email}
                            </span>
                        </div>
                    </ModalHeader>

                    <ModalBody className="gap-4">
                        {/* User Identity */}
                        <div className="bg-default-100 border border-default-200 rounded-xl p-3 space-y-1">
                            <p className="text-xs text-default-400 uppercase tracking-wider font-bold mb-2">
                                Identité
                            </p>
                            <p className="text-sm font-semibold text-foreground">{user.name}</p>
                            <p className="text-xs text-default-500 font-mono break-all">
                                ID: {user.sub}
                            </p>
                        </div>

                        <Divider className="bg-default-100" />

                        {/* Token Status */}
                        <div className="space-y-2">
                            <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                                {t("nav-user-dropdown-token-status")}
                            </p>
                            {tokenPayload?.exp ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-default-500">{t("nav-user-dropdown-expires-in")}</span>
                                        <Chip
                                            size="sm"
                                            color={isExpiringSoon ? "danger" : "success"}
                                            variant="flat"
                                            className="font-mono font-bold text-xs"
                                        >
                                            {formatDuration(secondsLeft, t)}
                                        </Chip>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-default-500">
                                        <span>Expiration</span>
                                        <span className="font-mono text-default-400">
                                            {formatExpiry(tokenPayload.exp)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-danger">{t("nav-user-dropdown-no-expiry")}</p>
                            )}
                        </div>

                        {/* Permissions */}
                        {permissions.length > 0 && (
                            <>
                                <Divider className="bg-default-100" />
                                <div className="space-y-2">
                                    <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                                        Permissions
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {permissions.map((perm) => {
                                            if (perm === import.meta.env.ADMIN_AUTH0_PERMISSION as string) {
                                                return (
                                                    <AuthenticationGuardWithPermission
                                                        key={perm}
                                                        permission={import.meta.env.ADMIN_AUTH0_PERMISSION as string}
                                                    >
                                                        <Chip
                                                            size="sm"
                                                            variant="solid"
                                                            color="primary"
                                                            className="text-xs font-mono cursor-pointer hover:bg-primary-600 transition-colors"
                                                            onClick={() => {
                                                                navigate("/admin/users");
                                                                onClose();
                                                            }}
                                                        >
                                                            {perm} (Admin Panel)
                                                        </Chip>
                                                    </AuthenticationGuardWithPermission>
                                                );
                                            }

                                            return (
                                                <Chip
                                                    key={perm}
                                                    size="sm"
                                                    variant="flat"
                                                    color="secondary"
                                                    className="text-xs font-mono"
                                                >
                                                    {perm}
                                                </Chip>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        <Divider className="bg-default-100" />

                        {/* Access Token */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                                    {t("nav-user-dropdown-access-token")}
                                </p>
                                <CopyButton
                                    value={accessToken ?? ""}
                                    className="h-7 w-7 min-w-7"
                                    variant="flat"
                                    color="default"
                                />
                            </div>
                            <ScrollShadow
                                className="h-[80px] w-full"
                                orientation="horizontal"
                            >
                                <p className="text-[10px] text-default-500 font-mono break-all leading-relaxed select-all">
                                    {accessToken || t("nav-user-dropdown-loading")}
                                </p>
                            </ScrollShadow>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }
);

UserTechnicalInfoModal.displayName = "UserTechnicalInfoModal";
