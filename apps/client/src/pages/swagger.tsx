import DefaultLayout from "@/layouts/default";
import { OpenAPI } from "@/components/openapi";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function SwaggerPage() {
  const { t } = useTranslation();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [bearer, setBearer] = useState<string | undefined>(undefined);

  // fetch an access token when we become authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setBearer(undefined);
      return;
    }

    getAccessTokenSilently()
      .then((token) => setBearer(token))
      .catch((err) => {
        console.error("failed to acquire access token", err);
        setBearer(undefined);
      });
  }, [isAuthenticated, getAccessTokenSilently]);

  // Re‑use the same logic that used to live inside the component
  const source = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL + "openapi.json"
    : import.meta.env.BASE_URL + "/openapi.json";

  const dataServers = [
    (import.meta.env.API_BASE_URL as string).endsWith("/api")
      ? (import.meta.env.API_BASE_URL as string).split("/api")[0]
      : ( import.meta.env.API_BASE_URL as string),
  ];

  const description = t("api-server");

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <OpenAPI
          source={source}
          dataServers={dataServers}
          description={description}
          bearer={bearer}
        />
      </section>
    </DefaultLayout>
  );
}
