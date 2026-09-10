import { randomBytes } from "node:crypto";

/**
 * 256 bits of entropy as 43 URL-safe characters.
 *
 * Deliberately a stored random value rather than an HMAC: an unsubscribe link
 * must keep working forever, and a token signed with ADMIN_SESSION_SECRET would
 * silently break in every already-delivered email the day that secret rotates.
 * Verification is a unique-index lookup, so this is O(1) and revocable.
 */
export function newToken(): string {
  return randomBytes(32).toString("base64url");
}
