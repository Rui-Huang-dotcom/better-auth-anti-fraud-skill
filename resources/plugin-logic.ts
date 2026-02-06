import { Plugin, BetterAuthError } from "@better-auth/core";
import { FingerprintJsServerApiClient } from "@fingerprintjs/fingerprintjs-pro-server";
import { eq, sql } from "drizzle-orm";
import { db } from "../../src/db"; // Adjust path to your Drizzle DB instance
import * as schema from "../../src/db/schema"; // Adjust path to your Drizzle schema

/**
 * Anti-Fraud Plugin for Better Auth
 * 
 * Strategy: Threshold-based blocking using device fingerprints.
 * It allows a small number of accounts (e.g., 3) per device,
 * but blocks mass registration attempts. It also integrates with FingerprintJS Pro Server API
 * for advanced device intelligence.
 */
export const antiFraudPlugin = (options?: { threshold?: number }): Plugin => {
  const THRESHOLD = options?.threshold || 3;

  return {
    name: "anti-fraud-plugin",
    hooks: {
      before: async (ctx) => {
        // CRITICAL: Ensure fingerprintHash is passed via metadata from frontend
        const fingerprintHash = ctx.request.metadata?.fingerprintHash as string | undefined;

        if (fingerprintHash) {
          // --- Server-side FingerprintJS Pro API Integration (Optional but Recommended) ---
          // In a real application, you would use FINGERPRINT_SECRET_API_KEY to call
          // FingerprintJS Pro Server API to get more device details and fraud signals.
          // For this skill, we primarily use the hash for threshold blocking.
          // const client = new FingerprintJsServerApiClient({
          //   apiKey: process.env.FINGERPRINT_SECRET_API_KEY!,
          //   region: "us", // Or your region
          // });
          // const eventResponse = await client.getEvent(fingerprintHash);
          // console.log("FingerprintJS Pro Event Response:", eventResponse);
          // --- End FingerprintJS Pro API Integration ---

          // --- Threshold-based Blocking Logic ---
          // Count existing accounts with this fingerprint
          // Ensure 'user' table and 'fingerprintHash' column exist in your schema
          if (schema.user && schema.user.fingerprintHash) {
            const result = await db.select({ count: sql<number>`count(*)` })
              .from(schema.user)
              .where(eq(schema.user.fingerprintHash, fingerprintHash));

            const registrationCount = result[0]?.count || 0;

            if (registrationCount >= THRESHOLD) {
              throw new BetterAuthError({
                code: "DEVICE_FINGERPRINT_LIMIT_EXCEEDED",
                message: `Security Alert: Too many accounts registered from this device. Limit: ${THRESHOLD}`,
                status: 403,
              });
            }
          }
          // Ensure fingerprintHash is available in metadata for 'after' hook or other plugins
          ctx.request.metadata = { ...ctx.request.metadata, fingerprintHash };
        }
        return ctx;
      },
      after: async (ctx) => {
        // Store fingerprintHash in user metadata after successful auth
        if (ctx.response.user && ctx.request.metadata?.fingerprintHash) {
          // This part needs to be handled in your Drizzle schema extension for the user table
          // The Agent MUST ensure this update logic is correctly integrated into the project's db operations
          if (schema.user && schema.user.fingerprintHash) {
            await db.update(schema.user)
              .set({ fingerprintHash: ctx.request.metadata.fingerprintHash })
              .where(eq(schema.user.id, ctx.response.user.id));
          }
        }
        return ctx;
      },
    },
  };
};
