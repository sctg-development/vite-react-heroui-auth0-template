/**
 * Copyright (c) 2024-2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 *
 * Modal component displaying technical user/token information.
 * Shown in the bottom-right corner on desktop, centered on mobile.
 */

import { memo, useState, useEffect } from "react";
import { Modal } from "@heroui/react";
import { Chip } from "@heroui/react";
import { Separator } from "@heroui/react";
import { ScrollShadow } from "@heroui/react";
import { JWTPayload } from "jose";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { User } from "@auth0/auth0-react";

import { CopyButton } from "@/components/copy-button";
import { AuthenticationGuardWithPermission } from "@/authentication";

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

    const permissions =
      (tokenPayload?.permissions as string[] | undefined) ?? [];
    const isExpiringSoon = secondsLeft < 120;

    const handleOpenChange = (open: boolean) => {
      if (!open) onClose();
    };

    return (
      <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
        <Modal.Backdrop>
          <Modal.Container placement="bottom">
            <Modal.Dialog>
              {({ close }) => (
                <>
                  <Modal.CloseTrigger onPress={close} />
                  <Modal.Header className="flex items-center gap-2 border-b border-default-100 pb-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-foreground text-base leading-tight">
                        {t("nav-user-dropdown-connected-as")}
                      </span>
                      <span className="text-sm font-semibold text-primary truncate max-w-[300px]">
                        {user.email}
                      </span>
                    </div>
                  </Modal.Header>

                  <Modal.Body className="px-5 py-4 space-y-4">
                    {/* User Identity */}
                    <div className="bg-default-100 border border-default-200 rounded-xl p-3 space-y-1">
                      <p className="text-xs text-default-400 uppercase tracking-wider font-bold mb-2">
                        Identité
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-default-500 font-mono break-all">
                        ID: {user.sub}
                      </p>
                    </div>

                    <Separator className="my-2" />

                    {/* Token Status */}
                    <div className="space-y-2">
                      <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                        {t("nav-user-dropdown-token-status")}
                      </p>
                      {tokenPayload?.exp ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-default-500">
                              {t("nav-user-dropdown-expires-in")}
                            </span>
                            <Chip
                              className="font-mono font-bold text-xs"
                              color={isExpiringSoon ? "danger" : "success"}
                              size="sm"
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
                        <p className="text-xs text-danger">
                          {t("nav-user-dropdown-no-expiry")}
                        </p>
                      )}
                    </div>

                    {/* Permissions */}
                    {permissions.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                            Permissions
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {permissions.map((perm) => {
                              if (
                                perm ===
                                (import.meta.env.ADMIN_AUTH0_PERMISSION as string)
                              ) {
                                return (
                                  <AuthenticationGuardWithPermission
                                    key={perm}
                                    permission={
                                      import.meta.env.ADMIN_AUTH0_PERMISSION as string
                                    }
                                  >
                                    <Chip
                                      className="text-xs font-mono cursor-pointer bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                                      size="sm"
                                      onClick={() => {
                                        navigate("/admin/users");
                                        close();
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
                                  className="text-xs font-mono bg-default-100 text-default-700"
                                  size="sm"
                                >
                                  {perm}
                                </Chip>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="my-2" />

                    {/* Access Token */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-default-400 uppercase tracking-wider font-bold">
                          {t("nav-user-dropdown-access-token")}
                        </p>
                        <CopyButton
                          className="h-7 w-7 min-w-7"
                          value={accessToken ?? ""}
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
                  </Modal.Body>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    );
  },
);

UserTechnicalInfoModal.displayName = "UserTechnicalInfoModal";
