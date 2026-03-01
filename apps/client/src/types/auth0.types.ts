/*
 * Copyright (c) 2026 Ronan LE MEILLAT
 * License: AGPL-3.0-or-later
 */

export interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  nickname: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  logins_count: number;
}

export interface Auth0Role {
  id: string;
  name: string;
  description: string;
}

export interface Auth0Permission {
  permission_name: string;
  description: string;
  resource_server_identifier: string;
  resource_server_name: string;
}

/**
 * Response on success returned by the worker route /api/__auth0/token
 */
export interface Auth0ManagementTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  /** true si le token provient du cache KV (pas d'appel Auth0 fait) */
  from_cache?: boolean;
}

/** Error returned by the worker route /api/__auth0/token */
export interface Auth0ManagementTokenError {
  success: false;
  error: string;
}

/** Union type for /api/__auth0/token */
export type Auth0ManagementTokenApiResponse =
  | Auth0ManagementTokenResponse
  | Auth0ManagementTokenError;
