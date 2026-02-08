/**
 * @copyright Copyright (c) 2024-2026 Ronan LE MEILLAT
 * @license AGPL-3.0-or-later
 */
// JWKS cache utility for template
import { createLocalJWKSet } from "jose";

const DEFAULT_TTL_S = Number(import.meta.env.AUTH0_CACHE_DURATION_S ?? 300);
const STORAGE_KEY = (domain: string) => `jwks:${domain}`;

const inMemoryCache = new Map<string, ReturnType<typeof createLocalJWKSet>>();
let inFlightFetches = new Map<
  string,
  Promise<ReturnType<typeof createLocalJWKSet>>
>();

async function fetchJwksJson(domain: string) {
  const resp = await fetch(`https://${domain}/.well-known/jwks.json`, {
    headers: { Accept: "application/json, application/jwk-set+json" },
  });

  if (!resp.ok) throw new Error(`Failed to fetch jwks.json: ${resp.status}`);

  return (await resp.json()) as any;
}

export async function getLocalJwkSet(domain: string) {
  if (inMemoryCache.has(domain)) return inMemoryCache.get(domain)!;
  if (inFlightFetches.has(domain)) return await inFlightFetches.get(domain)!;

  const promise = (async () => {
    try {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY(domain));

        if (raw) {
          const parsed = JSON.parse(raw);
          const ageS = (Date.now() - (parsed.uat || 0)) / 1000;
          const ttl = Number(
            import.meta.env.AUTH0_CACHE_DURATION_S ?? DEFAULT_TTL_S,
          );

          if (ageS < ttl && parsed.jwks) {
            const local = createLocalJWKSet(parsed.jwks);

            inMemoryCache.set(domain, local);

            return local;
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          "Failed to load JWKS from sessionStorage, fetching anew",
          e,
        );
        // ignore
      }

      const jwks = await fetchJwksJson(domain);
      const local = createLocalJWKSet(jwks);

      try {
        sessionStorage.setItem(
          STORAGE_KEY(domain),
          JSON.stringify({ jwks, uat: Date.now() }),
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Failed to save JWKS to sessionStorage", e);
      }

      inMemoryCache.set(domain, local);

      return local;
    } finally {
      inFlightFetches.delete(domain);
    }
  })();

  inFlightFetches.set(domain, promise);

  return await promise;
}
