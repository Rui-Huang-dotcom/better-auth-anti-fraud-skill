// resources/plugin-logic.ts
// Better Auth Server Plugin for Device Fingerprinting (Single Table).

import { BetterAuthPlugin, BetterAuthError } from 'better-auth';
import { eq } from 'drizzle-orm';
import { user } from '../../db/schema'; // Adjust path to your schema

export const antiFraudPlugin = (): BetterAuthPlugin => {
  return {
    id: 'anti-fraud',
    hooks: {
      'emailAndPassword.register': {
        before: async (ctx) => {
          const { payload, db } = ctx;
          const fingerprint = payload.deviceFingerprint as string | undefined;

          if (!fingerprint) return;

          // Check if this fingerprint is already associated with an existing user
          const existingUser = await db.select()
            .from(user)
            .where(eq(user.fingerprintHash, fingerprint))
            .limit(1);

          if (existingUser.length > 0) {
            throw new BetterAuthError({
              code: 'DEVICE_FINGERPRINT_BLOCKED',
              message: 'This device is already linked to an account.',
              status: 403,
            });
          }
        }
      }
    }
  };
};
