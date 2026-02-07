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

import { Button } from "@heroui/button";
import React from "react";
import { Link } from "@heroui/link";
import { Trans, useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

import { useCookieConsent } from "../contexts/cookie-consent-context";

import { buttonGradient } from "./primitives";

import { siteConfig } from "@/config/site";

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const { cookieConsent, acceptCookies, rejectCookies } = useCookieConsent();

  // État pour contrôler la visibilité du modal
  const isOpen = cookieConsent === "pending" && siteConfig().needCookieConsent;

  return (
    <Modal
      backdrop="blur"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
      placement="bottom"
    >
      <ModalContent>
        <ModalHeader className="text-lg font-semibold text-default-900">
          {t("cookie-consent-title")}
        </ModalHeader>
        <ModalBody className="text-small font-normal text-default-700">
          <Trans i18nKey="cookie-consent" t={t} />
          &nbsp;
          <Link className="text-small" href="#">
            {t("cookie-policy")}
          </Link>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <div className="mt-4 flex items-center gap-x-1">
            <Button
              className={buttonGradient({ bordered: "violet" })}
              onPress={acceptCookies}
            >
              {t("accept-all")}
            </Button>
            <Button
              className="rounded-large"
              variant="bordered"
              onPress={rejectCookies}
            >
              {t("reject")}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
