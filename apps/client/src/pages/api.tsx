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

import { Trans, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Snippet } from "@heroui/snippet";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useAuth, useSecuredApi } from "@/authentication";

export default function ApiPage() {
  const { t } = useTranslation();
  const { getJson } = useSecuredApi();
  const { user, isAuthenticated } = useAuth();
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const response = await getJson(
            `${import.meta.env.API_BASE_URL}/get/${user?.sub}`,
          );

          setApiResponse(response);
        } catch (error) {
          setApiResponse((error as Error).message);
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>
            <Trans t={t}>api-answer</Trans>
          </h1>
        </div>
        <Snippet className="max-w-11/12" symbol="" title="api-response">
          <div className="max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-5xl  whitespace-break-spaces  text-wrap break-words">
            {JSON.stringify(apiResponse, null, 2)}
          </div>
        </Snippet>
      </section>
    </DefaultLayout>
  );
}
