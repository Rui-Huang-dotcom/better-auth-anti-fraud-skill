// resources/schema-snippet.ts
// Add these fields to your existing 'user' table in Drizzle schema.

import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Optimized User Table for Better Auth + Anti-Fraud
 * 
 * Note: fingerprintHash is NOT unique to allow for threshold-based blocking
 * (e.g., allowing 3 accounts per device to prevent false positives).
 */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false), // For Resend verification
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  
  // Anti-Fraud Field: Stores the unique device fingerprint hash
  // Removed .unique() to support threshold-based anti-fraud logic
  fingerprintHash: text('fingerprint_hash'), 
});
