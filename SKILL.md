---
name: better-auth-anti-fraud
description: A professional Agent Skill to inject a secure, anti-fraud authentication layer into any Next.js/React project. It automates the setup of Better Auth, Drizzle ORM, Resend (with email verification), and Threshold-based Device Fingerprinting to block multi-account abuse.
---

# Better Auth Anti-Fraud Skill: The Ultimate Auth Hub

This skill transforms a basic authentication setup into a professional-grade, anti-fraud system. It leverages the official Better Auth CLI for schema generation and adds a custom anti-fraud layer.

## 1. Decision Tree for the Agent

```
Is this a new project or an upgrade?
├─ NEW → 1. Install better-auth 2. Create auth.ts 3. Run CLI generate
└─ UPGRADE → 1. Audit existing auth 2. Inject anti-fraud plugin 3. Run CLI generate
```

## 2. Implementation Workflow

### Step 2.1: Environment & Dependencies
1. **Install Packages**: `npm install better-auth drizzle-orm resend @fingerprintjs/fingerprintjs lucide-react`.
2. **Shadcn UI**: Ensure `button`, `input`, `card`, `form` components are installed.

### Step 2.2: Better Auth Configuration (`src/lib/auth.ts`)
The Agent MUST create or modify the Better Auth configuration.

- **Action**: Use `betterAuth` with `drizzleAdapter`.
- **Anti-Fraud Integration**: Include the plugin from `<reference>resources/plugin-logic.ts</reference>`.
- **Email Verification**: Enable `emailAndPassword.requireEmailVerification: true` and configure `sendVerificationEmail` using Resend and `<reference>resources/email-templates.tsx</reference>`.

### Step 2.3: Automated Schema Generation (CRITICAL)
Instead of manual schema writing, the Agent MUST use the official CLI to ensure all tables (user, session, account, verification) are correctly defined.

1. **Generate Schema**: Run `npx @better-auth/cli@latest generate --output src/db/auth-schema.ts`.
2. **Inject Anti-Fraud Field**: The Agent MUST manually add `fingerprintHash: text("fingerprintHash")` to the `user` table in the generated `auth-schema.ts`.
3. **Database Sync**: Run `npx drizzle-kit push` to apply the schema to the database.

### Step 2.4: Route Handler (`app/api/auth/[...all]/route.ts`)
- **Action**: Create the Next.js App Router handler:
  ```typescript
  import { auth } from "@/lib/auth";
  import { toNextJsHandler } from "better-auth/next-js";
  export const { GET, POST } = toNextJsHandler(auth);
  ```

### Step 2.5: Frontend Implementation
- **Action**: Create auth pages using:
    - **Registration**: `<reference>examples/shadcn-register-form.tsx</reference>` (includes fingerprinting).
    - **Login/Forgot/Reset**: Create standard Shadcn forms following the patterns in `examples/`.

## 3. Configuration Guides

### 3.1. Environment Variables (STRICT QUOTING)
The Agent MUST wrap ALL values in double quotes and MUST NOT remove existing quotes.

```env
BETTER_AUTH_SECRET="<32+ chars, generate with: openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL="<your-supabase-connection-string>"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
RESEND_API_KEY="..."
```

### 3.2. Google OAuth Setup
1. **Redirect URI**: Add `${BETTER_AUTH_URL}/api/auth/callback/google` to Google Cloud Console.

## 4. Security Checklist
- [ ] `BETTER_AUTH_SECRET` is 32+ chars.
- [ ] `BETTER_AUTH_URL` matches the environment.
- [ ] `emailVerification` is enabled and tested.
- [ ] `fingerprintHash` is present in the database.

## 5. References
- `<reference>resources/plugin-logic.ts</reference>`: Anti-fraud plugin.
- `<reference>resources/email-templates.tsx</reference>`: Email templates.
- `<reference>examples/shadcn-register-form.tsx</reference>`: Registration form.
- `<reference>examples/forgot-password-form.tsx</reference>`: Forgot password form.
- `<reference>examples/reset-password-form.tsx</reference>`: Reset password form.
