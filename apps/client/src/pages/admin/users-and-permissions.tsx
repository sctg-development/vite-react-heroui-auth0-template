/**
 * @copyright Copyright (c) 2024-2026 Ronan LE MEILLAT (base) / KduFoot adaptation
 * @license AGPL-3.0-or-later
 *
 * Administration Page: Management of Auth0 users and their KduFoot permissions.
 * Restricted to users with the `auth0:admin:api` permission.
 *
 * Workflow:
 *  1. On mount, POST call to /api/__auth0/token (via Cloudflare worker) to get the Management API token.
 *     → The token is cached in the worker KV Store to minimize Auth0 API calls.
 *  2. The Management token is used client-side to call the Auth0 Management API directly.
 *     → Listing users, fetching permissions, and performing add/remove operations.
 */

import type {
  Auth0ManagementTokenResponse,
  Auth0User,
  Auth0Permission,
} from "@/types/auth0.types";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { useAuth0 } from "@auth0/auth0-react";

import DefaultLayout from "@/layouts/default";
import { useSecuredApi } from "@/authentication";
const Permission = import.meta.env.PERMISSIONS as string[];

export default function UsersAndPermissionsPage() {
  const { user: currentUser } = useAuth0();
  const currentUserId = (currentUser?.sub ?? "").toString().trim();
  const { t } = useTranslation();

  const {
    getAuth0ManagementToken,
    listAuth0Users,
    getUserPermissions,
    addPermissionToUser,
    removePermissionFromUser,
    deleteAuth0User,
    checkResourceServerScopesWithAudience,
    updateResourceServerScopesWithAudience,
  } = useSecuredApi();

  const [mgmtToken, setMgmtToken] = useState<string | null>(null);
  const [tokenFromCache, setTokenFromCache] = useState<boolean>(false);
  const [users, setUsers] = useState<Auth0User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // { userId: { permKey: boolean } } — Tracks the local state of permission edits
  const [editing, setEditing] = useState<
    Record<string, Record<string, boolean>>
  >({});
  // userId of the user currently being edited in the modal
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState<boolean | null>(null);

  /**
   * Helper to verify if Auth0 Resource Server scopes are synchronized with the local Permission enum.
   */
  const checkSyncStatus = async (token: string) => {
    try {
      const audience = import.meta.env.AUTH0_AUDIENCE;
      const targetScopes = Object.values(Permission).map((val) => {
        const value = val as string;

        return {
          value,
          description: t(`permission-${value.replace(/:/g, "-")}`, value),
        };
      });
      const upToDate = await checkResourceServerScopesWithAudience(
        token,
        audience,
        targetScopes,
      );

      setIsUpToDate(upToDate);
    } catch (err) {
      console.error("Error checking sync status:", err);
      setIsUpToDate(false); // Default to false on error to allow manual sync
    }
  };

  // ─── 1. Access Token and Initial User Load ────────────────────────────
  useEffect(() => {
    getAuth0ManagementToken()
      .then(async (resp) => {
        if ("access_token" in resp) {
          const tokenResp = resp as Auth0ManagementTokenResponse;

          setMgmtToken(tokenResp.access_token);
          setTokenFromCache(tokenResp.from_cache ?? false);

          // Trigger sync check to verify if Auth0 API is configured with latest scopes
          checkSyncStatus(tokenResp.access_token);

          // Fetch the list of users from Auth0
          try {
            const u = await listAuth0Users(tokenResp.access_token);

            setUsers(u ?? []);
          } catch (err) {
            console.error("Error loading users:", err);
            addToast({
              title: t("error"),
              description: t("admin-users-toast-error-loading-users"),
              variant: "solid",
            });
          }
        } else {
          addToast({
            title: t("error"),
            description: t("admin-users-toast-no-management-token"),
            variant: "solid",
          });
        }
      })
      .catch((err) => {
        console.error("Management token error:", err);
        addToast({
          title: t("error"),
          description: t("admin-users-toast-no-management-token"),
          variant: "solid",
        });
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  // ─── 2. Edit Permissions Modal ─────────────────────────────────────────
  const openUserEditing = async (userId: string) => {
    if (!mgmtToken) return;
    setSelectedUserId(userId);
    setModalLoading(true);
    try {
      // Fetch current permissions assigned to this user in Auth0
      const perms: Auth0Permission[] = await getUserPermissions(
        mgmtToken,
        userId,
      );

      // We only want to manage permissions related to our specific API (Audience)
      const audience = (import.meta as any)?.env?.AUTH0_AUDIENCE ?? "";
      const permNames = perms
        .filter((p) => {
          if (!audience) return true;
          const rs = p.resource_server_identifier ?? "";

          // Support exact match or identifier containing the audience
          return (
            rs === audience || rs.includes(audience) || audience.includes(rs)
          );
        })
        .map((p) => p.permission_name);

      // Initialize the editing state:
      // For each known permission in our local 'Permission' enum,
      // check if the user already has it in Auth0.
      const permState: Record<string, boolean> = {};

      for (const permValue of Permission) {
        permState[permValue] = permNames.includes(permValue);
      }
      setEditing((prev) => ({ ...prev, [userId]: permState }));
    } catch (err) {
      console.error("Error loading permissions from Auth0:", err);
      addToast({
        title: t("error"),
        description: t("admin-users-toast-error-loading-perms"),
        variant: "solid",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // ─── 3. Toggle Permission locally ───────────────────────────────────────
  const togglePermission = (userId: string, permKey: string) => {
    setEditing((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] ?? {}),
        [permKey]: !(prev[userId]?.[permKey] ?? false),
      },
    }));
  };

  // ─── 4. Save Permissions to Auth0 ───────────────────────────────────────
  const savePermissions = async (userId: string) => {
    if (!mgmtToken) return;
    setSavingUserId(userId);
    try {
      const edits = editing[userId] ?? {};
      const currentPerms: Auth0Permission[] = await getUserPermissions(
        mgmtToken,
        userId,
      );
      const audience = (import.meta as any)?.env?.AUTH0_AUDIENCE ?? "";
      const currentNames = currentPerms
        .filter((p) => {
          const rs = p.resource_server_identifier ?? "";

          return (
            !audience ||
            rs === audience ||
            rs.includes(audience) ||
            audience.includes(rs)
          );
        })
        .map((p) => p.permission_name);

      // Compare the desired state (edits) with the current state (currentNames)
      // and perform the necessary Auth0 API calls to synchronize them.
      for (const permValue of Permission) {
        if (!Object.prototype.hasOwnProperty.call(edits, permValue)) continue;

        const shouldHave = edits[permValue];
        const hasIt = currentNames.includes(permValue);

        if (shouldHave && !hasIt) {
          // Add permission if it was checked but user doesn't have it yet
          await addPermissionToUser(mgmtToken, userId, permValue);
        } else if (!shouldHave && hasIt) {
          // Remove permission if it was unchecked but user currently has it
          await removePermissionFromUser(mgmtToken, userId, permValue);
        }
      }

      addToast({
        title: t("success"),
        description: t("admin-users-toast-success-update"),
        variant: "solid",
        timeout: 4000,
      });
      setEditing((prev) => ({ ...prev, [userId]: {} }));
      setSelectedUserId(null);
    } catch (err) {
      console.error("Error saving permissions:", err);
      addToast({
        title: t("error"),
        description: t("error-updating-user"),
        variant: "solid",
      });
    } finally {
      setSavingUserId(null);
    }
  };

  // ─── 5. Delete User ────────────────────────────────────────────────────
  const deleteUser = async (userId: string) => {
    if (!mgmtToken) return;
    if (userId === currentUserId) {
      addToast({
        title: t("error"),
        description: t("admin-users-toast-cannot-delete-self"),
        variant: "solid",
      });

      return;
    }
    if (!window.confirm(t("admin-users-confirm-delete-prefix", { userId })))
      return;
    try {
      await deleteAuth0User(mgmtToken, userId);
      // Locally update the UI to remove the deleted user
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      if (selectedUserId === userId) setSelectedUserId(null);
      addToast({
        title: t("success"),
        description: t("admin-users-toast-success-delete"),
        variant: "solid",
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      addToast({
        title: t("error"),
        description: t("admin-users-toast-error-delete"),
        variant: "solid",
      });
    }
  };

  // ─── 6. Sync App Permissions with Auth0 Resource Server ─────────────────
  const syncAuth0Permissions = async () => {
    if (!mgmtToken) return;
    setIsSyncing(true);
    try {
      const audience = import.meta.env.AUTH0_AUDIENCE;

      // 'Scopes' in Auth0 are essentially our local permissions.
      // We map our Permission enum values to the format expected by the
      // Auth0 Management API: a 'value' and a 'description'.
      const targetScopes = Object.values(Permission).map((val) => {
        const value = val as string;

        return {
          value,
          // Use the i18n translation or fallback to the raw value
          description: t(`permission-${value.replace(/:/g, "-")}`, value),
        };
      });

      // Verify if the Auth0 Resource Server (API) is already up to date
      // with our local permission list.
      const isUpToDate = await checkResourceServerScopesWithAudience(
        mgmtToken,
        audience,
        targetScopes,
      );

      if (isUpToDate) {
        addToast({
          title: t("success"),
          description: t("admin-users-toast-sync-success"),
          variant: "solid",
          timeout: 5000,
        });

        return;
      }

      // If not up to date, perform the 'PATCH' call to Auth0 to add missing scopes
      await updateResourceServerScopesWithAudience(
        mgmtToken,
        audience,
        targetScopes,
      );
      setIsUpToDate(true);

      addToast({
        title: t("success"),
        description: t("admin-users-toast-sync-success"),
        variant: "solid",
        timeout: 5000,
      });
    } catch (err) {
      console.error("Error synchronizing Auth0 Resource Server:", err);
      const msg = (err as Error).message ?? "";

      addToast({
        title: t("error"),
        description: msg.includes("not found")
          ? t("admin-users-toast-no-resource-server")
          : t("admin-users-toast-sync-error"),
        variant: "solid",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // ─── Rendering ──────────────────────────────────────────────────────────
  return (
    <DefaultLayout>
      <section className="flex flex-col gap-6 py-8 md:py-10 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {t("admin-users-page-title")}
            </h1>
            <p className="text-default-500 text-sm mt-1">
              {t("admin-users-page-subtitle")}
              {tokenFromCache && (
                <span className="ml-2 text-success-600 text-xs">
                  {t("admin-users-cache-token-success")}
                </span>
              )}
            </p>
          </div>
          {isUpToDate === true ? (
            <Chip
              color="success"
              size="sm"
              startContent={<span className="ml-1">✓</span>}
              variant="flat"
            >
              {t("admin-users-auth0-up-to-date")}
            </Chip>
          ) : (
            <Button
              color="secondary"
              isDisabled={!mgmtToken || isUpToDate === null}
              isLoading={isSyncing}
              size="sm"
              variant="flat"
              onPress={syncAuth0Permissions}
            >
              {t("admin-users-btn-sync-auth0")}
            </Button>
          )}
        </div>

        {/* Users List Table */}
        {loadingUsers ? (
          <p className="text-default-500">{t("admin-users-loading-users")}</p>
        ) : (
          <Table aria-label="Auth0 Users" selectionMode="none">
            <TableHeader>
              <TableColumn>{t("admin-users-col-user")}</TableColumn>
              <TableColumn>{t("admin-users-col-email")}</TableColumn>
              <TableColumn>{t("admin-users-col-logins")}</TableColumn>
              <TableColumn>{t("admin-users-col-actions")}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={t("admin-users-empty-users")}>
              {users.map((u) => (
                <TableRow key={u.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {u.picture && (
                        <img
                          alt={u.name}
                          className="w-8 h-8 rounded-full"
                          src={u.picture}
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {u.name || u.nickname}
                        </p>
                        <p className="text-xs text-default-400">{u.user_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{u.email}</span>
                      {u.email_verified && (
                        <span className="text-success-500 text-xs">✓</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{u.logins_count ?? 0}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        isDisabled={!mgmtToken}
                        size="sm"
                        variant="flat"
                        onPress={() => openUserEditing(u.user_id)}
                      >
                        {t("admin-users-btn-permissions")}
                      </Button>
                      {u.user_id !== currentUserId && (
                        <Button
                          color="danger"
                          isDisabled={!mgmtToken}
                          size="sm"
                          variant="flat"
                          onPress={() => deleteUser(u.user_id)}
                        >
                          {t("admin-users-btn-delete")}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Permissions Edition Panel (Inline Modal) */}
        {selectedUserId && (
          <div className="mt-6 p-6 border border-default-200 rounded-xl bg-default-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {t("admin-users-modal-title-prefix")}{" "}
                <span className="text-primary">
                  {users.find((u) => u.user_id === selectedUserId)?.name ??
                    selectedUserId}
                </span>
              </h2>
              <Button
                size="sm"
                variant="light"
                onPress={() => {
                  setSelectedUserId(null);
                  setEditing((prev) => ({ ...prev, [selectedUserId]: {} }));
                }}
              >
                {t("admin-users-modal-btn-close")}
              </Button>
            </div>

            {modalLoading ? (
              <p className="text-default-500">
                {t("admin-users-modal-loading-perms")}
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {Permission.map((permValue) => (
                    <Checkbox
                      key={permValue}
                      isDisabled={
                        // Prevent removing one's own auth0:admin:api permission
                        // to avoid getting locked out of this page
                        selectedUserId === currentUserId &&
                        permValue === "auth0:admin:api"
                      }
                      isSelected={editing[selectedUserId]?.[permValue] ?? false}
                      size="sm"
                      onValueChange={() =>
                        togglePermission(selectedUserId, permValue)
                      }
                    >
                      <span className="text-xs">
                        {t(
                          `permission-${permValue.replace(/:/g, "-")}`,
                          permValue,
                        )}
                      </span>
                    </Checkbox>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    color="primary"
                    isDisabled={
                      Object.keys(editing[selectedUserId] ?? {}).length === 0
                    }
                    isLoading={savingUserId === selectedUserId}
                    onPress={() => savePermissions(selectedUserId)}
                  >
                    {t("admin-users-modal-btn-save")}
                  </Button>
                  <Button
                    variant="flat"
                    onPress={() => {
                      setSelectedUserId(null);
                      setEditing((prev) => ({ ...prev, [selectedUserId]: {} }));
                    }}
                  >
                    {t("admin-users-modal-btn-cancel")}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
