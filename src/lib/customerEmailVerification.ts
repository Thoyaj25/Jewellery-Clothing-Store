import { createHash, randomBytes } from "node:crypto";

export const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: hashEmailVerificationToken(token),
    expiresAt: new Date(
      Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000
    ),
  };
}

export function hashEmailVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
