import type React from "react";

import { Link } from "@heroui/link";
import { Trans, useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Snippet } from "@heroui/snippet";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { createRemoteJWKSet, JWTPayload, jwtVerify } from "jose";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<JWTPayload | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setAccessToken(token);
        const JWKS = createRemoteJWKSet(
          new URL(
            `https://${import.meta.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
          ),
        );

        jwtVerify(token, JWKS, {
          issuer: `https://${import.meta.env.AUTH0_DOMAIN}/`,
          audience: import.meta.env.AUTH0_AUDIENCE,
        }).then((jwt) => {
          setDecodedToken(jwt.payload as JWTPayload);
        });
      });
    }
  }, [isAuthenticated]);

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          title={t("heroui-com-homepage")}
        >
          <span className="text-default-600">
            <Trans ns="base">powered-by</Trans>
          </span>
          <p className="text-primary">HeroUI</p>
        </Link>
        &nbsp;
        <Dropdown>
          <DropdownTrigger>
            {isAuthenticated ? (
              <span>
                {t("user")}: &nbsp;{user?.name}
              </span>
            ) : (
              <></>
            )}
          </DropdownTrigger>
          <DropdownMenu className="max-w-5xl">
            <DropdownItem key="user-logged" textValue="user-logged">
              <span className="text-default-600">{t("token")}:</span>
              <br />
              <Snippet className="max-w-4xl" symbol="" title="api-response">
                <div className="max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-3xl  whitespace-break-spaces  text-wrap break-words">
                  {accessToken}
                </div>
              </Snippet>
              <br />
              <span className="text-default-600">
                {t("expiration")}:{" "}
                {new Date((decodedToken?.exp || 0) * 1000).toLocaleString()}
              </span>
              <br />
              <span className="text-default-600">
                {t("permissions")}:{" "}
                {((decodedToken?.permissions as string[]) || []).join(", ") ||
                  t("no-permissions")}
              </span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </footer>
    </div>
  );
}
