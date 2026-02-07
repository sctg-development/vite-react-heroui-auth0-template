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

import {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";

export type CookieConsentStatus = "pending" | "accepted" | "rejected";

interface CookieConsentContextType {
  cookieConsent: CookieConsentStatus;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetCookieConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

const COOKIE_CONSENT_KEY = "cookie-consent-status";

export const CookieConsentProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cookieConsent, setCookieConsent] =
    useState<CookieConsentStatus>("pending");

  // Load the cookie consent status from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (
      savedConsent &&
      (savedConsent === "accepted" || savedConsent === "rejected") // or  (savedConsent === "accepted") for showing the banner until the user accepts
    ) {
      setCookieConsent(savedConsent);
    }
  }, []);

  const acceptCookies = () => {
    setCookieConsent("accepted");
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    // Here you could enable all cookies
    // and tracking scripts
    // For example, you could load Google Analytics here
  };

  const rejectCookies = () => {
    setCookieConsent("rejected");
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    // Here you could disable all cookies
    // and tracking scripts
  };

  const resetCookieConsent = () => {
    setCookieConsent("pending");
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        cookieConsent,
        acceptCookies,
        rejectCookies,
        resetCookieConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);

  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider",
    );
  }

  return context;
};
