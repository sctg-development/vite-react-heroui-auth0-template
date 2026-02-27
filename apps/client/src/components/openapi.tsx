/**
 * MIT License
 *
 * Copyright (c) 2025-2026 Ronan LE MEILLAT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable no-console */
import { useEffect, useState, useCallback } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";

export function OpenAPI() {
    const { t } = useTranslation();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState<string | null>(null);
    const url = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL + "openapi.json"
        : import.meta.env.BASE_URL + "/openapi.json";

    /**
     * If user is authenticated, set the token
     */
    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then((token) => {
                setToken(token);
            });
        } else {
            setToken(null);
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    // Fetch the OpenAPI spec from the server
    const [openApiSpec, setOpenApiSpec] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.servers = [
                    {
                        url: import.meta.env.API_BASE_URL.endsWith("/api")
                            ? import.meta.env.API_BASE_URL.split("/api")[0]
                            : import.meta.env.API_BASE_URL,
                        description: t("api-server"),
                    },
                ];
                setOpenApiSpec(data);
            })
            .catch((error) => console.error("Error fetching OpenAPI spec:", error));
    }, [url, t]);

    // Callback when SwaggerUI is ready
    const [swaggerUIInstance, setSwaggerUIInstance] = useState<any>(null);

    const onComplete = useCallback((instance: any) => {
        console.log("SwaggerUI instance ready");
        setSwaggerUIInstance(instance);
    }, []);

    // Effect to set authorization when token or SwaggerUI instance changes
    useEffect(() => {
        if (token && swaggerUIInstance) {
            console.log("Setting bearer token:", token);
            swaggerUIInstance.preauthorizeApiKey("bearerAuth", token);
        }
    }, [token, swaggerUIInstance]);

    return (
        <SwaggerUI
            spec={openApiSpec as unknown as Object}
            onComplete={onComplete}
        />
    );
}