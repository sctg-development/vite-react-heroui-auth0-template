/**
 * MIT License
 *
 * Copyright (c) 2025 Ronan LE MEILLAT
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

export interface OpenAPIProps {
  /**
   * URL where the OpenAPI json should be fetched from.
   * If omitted the component will still attempt to read from
   * `import.meta.env.BASE_URL` as a fallback, but callers are
   * encouraged to supply the value explicitly for reusability.
   */
  source?: string;

  /**
   * List of server base URLs that will be injected into the
   * specification before rendering. Corresponds to `servers` in
   * the OpenAPI document.  _optional_ because the component is
   * sometimes rendered standalone (e.g. via a route) without
   * any props passed.
   */
  dataServers?: string[];

  /**
   * Human‑readable description that will be attached to each of
   * the provided servers (they all share the same description).
   */
  description: string;

  /**
   * Optional bearer token that will be used to pre‑authorize the
   * Swagger UI instance. The parent component is responsible for
   * obtaining or refreshing the token; this component has no
   * dependency on any SDK or authentication library.
   */
  bearer?: string;
}

export function OpenAPI({
  source,
  dataServers = [],
  description,
  bearer,
}: OpenAPIProps) {
  // compute the URL from prop or fallback to env
  const url =
    source ||
    (import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL + "openapi.json"
      : import.meta.env.BASE_URL + "/openapi.json");


  // Fetch the OpenAPI spec from the server
  const [openApiSpec, setOpenApiSpec] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // defensive: make sure we have an array before mapping
        data.servers = (dataServers || []).map((u) => ({ url: u, description }));
        setOpenApiSpec(data);
      })
      .catch((error) => console.error("Error fetching OpenAPI spec:", error));
  }, [url, dataServers, description]);

  // Callback when SwaggerUI is ready
  const [swaggerUIInstance, setSwaggerUIInstance] = useState<any>(null);

  const onComplete = useCallback((instance: any) => {
    console.log("SwaggerUI instance ready");
    setSwaggerUIInstance(instance);
  }, []);

  /**
   * whenever a bearer token is provided by the parent, apply it
   * to the UI. the parent is responsible for refreshing/obtaining
   * a token (e.g. via Auth0) so this component has no SDK
   * dependency.
   */
  useEffect(() => {
    if (bearer && swaggerUIInstance) {
      console.log("Setting bearer token:", bearer);
      swaggerUIInstance.preauthorizeApiKey("bearerAuth", bearer);
    }
  }, [bearer, swaggerUIInstance]);

    // Custom Swagger UI Plugin to display scope chips
    const ScopeChipsPlugin = () => {
        let currentSecurity: any = null;
        return {
            wrapComponents: {
                // Intercept the security props from OperationSummary
                OperationSummary: (Original: any) => (props: any) => {
                    const security = props.operationProps.get("security");
                    currentSecurity = security ? security.toJS() : null;
                    return <Original {...props} />;
                },
                // Render the scope chips before the original padlock button
                authorizeOperationBtn: (Original: any) => (props: any) => {
                    const scopes: string[] = [];
                    if (currentSecurity && Array.isArray(currentSecurity)) {
                        currentSecurity.forEach((scheme: any) => {
                            const schemeName = Object.keys(scheme)[0];
                            if (scheme[schemeName] && Array.isArray(scheme[schemeName])) {
                                scheme[schemeName].forEach((scope: string) => {
                                    if (!scopes.includes(scope)) {
                                        scopes.push(scope);
                                    }
                                });
                            }
                        });
                    }

                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {scopes.map((scope) => (
                                <span
                                    key={scope}
                                    style={{
                                        backgroundColor: "#4990e2", // Swagger UI typical blueish color
                                        color: "white",
                                        borderRadius: "12px",
                                        padding: "2px 8px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        fontFamily: "monospace",
                                        lineHeight: "1",
                                    }}
                                >
                                    {scope}
                                </span>
                            ))}
                            <Original {...props} />
                        </div>
                    );
                },
            },
        };
    };

    return (
        <SwaggerUI
            spec={openApiSpec as unknown as Object}
            onComplete={onComplete}
            plugins={[ScopeChipsPlugin]}
        />
    );
}