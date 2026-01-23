---
name: better-auth-anti-fraud
description: A high-performance Agent Skill to inject a secure, anti-fraud authentication layer into any Next.js/React project. It automates the setup of Better Auth, Drizzle ORM, Resend (with email verification), and Device Fingerprinting to block multi-account abuse.
---

# Better Auth Anti-Fraud Skill: The Ultimate Auth Wizard

This skill transforms a basic authentication setup into a professional-grade, anti-fraud system. It guides the Agent to implement device fingerprinting, email verification via Resend, and a sleek Shadcn UI registration flow.

## 1. When to Use This Skill

- When upgrading a basic auth starter (like Vercel's Drizzle starter) to include anti-fraud measures.
- When implementing "Register with Google" or "Email + Password" with mandatory email verification.
- When the user wants a modern, Shadcn UI-based authentication interface.

## 2. Implementation Workflow

### Step 2.1: Environment & Dependencies
1. **Install Packages**: Ensure `better-auth`, `drizzle-orm`, `resend`, `@fingerprintjs/fingerprintjs`, and `lucide-react` are installed.
2. **Shadcn UI**: If not present, initialize Shadcn and add: `button`, `input`, `card`, `label`, `toast`.
3. **Env Vars**: Verify `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.

### Step 2.2: Simplified Single-Table Schema
Modify the `auth_user` table in the Drizzle schema (e.g., `src/db/schema.ts`) to include anti-fraud and verification fields. Refer to `resources/schema-snippet.ts`.

### Step 2.3: Server-Side Anti-Fraud Plugin
Create `src/auth/plugins/anti-fraud.ts` using the logic in `resources/plugin-logic.ts`. This plugin:
- Intercepts registration to check if the `deviceFingerprint` already exists in the `auth_user` table.
- Blocks registration with a `DEVICE_FINGERPRINT_BLOCKED` error if a match is found.

### Step 2.4: Better Auth & Resend Configuration
Configure Better Auth in `src/auth/config.ts`:
- **Email Verification**: Enable `emailVerification` and use Resend to send the verification link.
- **Plugin Integration**: Add the `antiFraudPlugin` to the `plugins` array.
- **Custom Fields**: Map `deviceFingerprint` to the `fingerprintHash` column.

### Step 2.5: Shadcn UI Registration Form
Generate a high-vibe registration form using Shadcn UI components. Refer to `examples/shadcn-register-form.tsx`.
- **Logic**: Generate fingerprint on submit -> Pass to `signUp.email()` -> Handle verification state.

## 3. Configuration Wizard

### 3.1. Supabase Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Project Settings** > **Database**.
3. Copy the **Connection String** (URI). Use the `Transaction` mode (port 6543) for serverless environments.
4. Add to `.env`: `DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:6543/postgres"`.
5. **Pro Tip**: If using the Supabase MCP, the Agent can verify table creation using `npx drizzle-kit push`.
   
### 3.2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create OAuth Client ID (Web Application).
3. Set Redirect URI: `http://localhost:3000/api/auth/callback/google`.
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`.

### 3.3. Resend Setup
1. Create account at [resend.com](https://resend.com).
2. Generate API Key with `Send emails` permission.
3. Add `RESEND_API_KEY` to `.env`.

## 4. References (Claude & Antigravity Compatible)

The following resources provide the exact code snippets for implementation:

- **Schema Extension**: [resources/schema-snippet.ts](./resources/schema-snippet.ts)
- **Plugin Logic**: [resources/plugin-logic.ts](./resources/plugin-logic.ts)
- **Shadcn Form Example**: [examples/shadcn-register-form.tsx](./examples/shadcn-register-form.tsx)
- **Setup Script**: [scripts/setup.sh](./scripts/setup.sh)

---
**Best Practice**: Always run `npx drizzle-kit push` after schema changes to sync with Supabase.
