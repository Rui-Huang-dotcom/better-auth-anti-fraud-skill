// resources/plugin-logic.ts
import { BetterAuthPlugin, BetterAuthError } from 'better-auth';
import { eq, sql } from 'drizzle-orm';
import { user } from '../../db/schema'; // Adjust path to your schema

/**
 * Anti-Fraud Plugin for Better Auth
 * 
 * Strategy: Threshold-based blocking.
 * Instead of blocking a fingerprint after 1 registration (which causes false positives),
 * we allow a small number of accounts (e.g., 3) per device to accommodate shared computers,
 * but block mass registration attempts.
 */
export const antiFraudPlugin = (options?: { threshold?: number }): BetterAuthPlugin => {
  const THRESHOLD = options?.threshold || 3;

  return {
    id: 'anti-fraud',
    hooks: {
      'emailAndPassword.register': {
        before: async (ctx) => {
          const { payload, db } = ctx;
          const fingerprint = payload.deviceFingerprint as string | undefined;

          if (!fingerprint) return;

          // Count existing accounts with this fingerprint
          const result = await db.select({ count: sql<number>`count(*)` })
            .from(user)
            .where(eq(user.fingerprintHash, fingerprint));

          const registrationCount = result[0]?.count || 0;

          if (registrationCount >= THRESHOLD) {
            throw new BetterAuthError({
              code: 'DEVICE_FINGERPRINT_LIMIT_EXCEEDED',
              message: 'Security Alert: Too many accounts registered from this device.',
              status: 403,
            });
          }
        }
      }
    }
  };
};
