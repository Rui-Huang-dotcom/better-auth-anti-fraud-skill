// resources/schema-snippet.ts
// Add these fields to your existing 'user' table in Drizzle schema.

import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false), // For Resend verification
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  
  // Anti-Fraud Field: Stores the unique device fingerprint hash
  fingerprintHash: text('fingerprint_hash').unique(), 
});
