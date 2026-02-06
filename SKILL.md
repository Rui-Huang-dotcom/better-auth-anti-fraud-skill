# Better Auth Anti-Fraud Skill

This skill enhances your Next.js application with a robust authentication system using Better Auth, Drizzle ORM, Supabase, and integrates advanced anti-fraud capabilities via FingerprintJS.

## 1. Overview

This skill automates the setup of a secure, production-ready authentication hub with email/password, Google OAuth, and real-time fraud detection. It's designed for Next.js App Router projects using TypeScript and TailwindCSS.

## 2. Prerequisites

Before running this skill, ensure you have:

*   A Next.js project initialized with `npx create-next-app@latest` (with TypeScript, TailwindCSS, ESLint, and App Router).
*   A Supabase project with its connection string.
*   Google Cloud Project credentials (Client ID, Client Secret) for OAuth.
*   Resend API Key for email verification.
*   **FingerprintJS Pro API Key**: Both `NEXT_PUBLIC_FINGERPRINT_PUBLIC_API_KEY` (for frontend) and `FINGERPRINT_SECRET_API_KEY` (for backend server-side verification) are required for full anti-fraud functionality.

## 3. Configuration Guides and References

**CRITICAL: The Agent MUST strictly follow these configuration steps. Any deviation will lead to errors.**

### 3.1. Environment Variables (IMMUTABLE ENV POLICY - CRITICAL)

**The Agent MUST NOT modify or remove existing entries in the `.env` file. For any new variables, the Agent MUST append them. All values MUST be wrapped in double quotes, especially those containing special characters or spaces. The Agent MUST NOT strip existing quotes.**

Example `.env` structure:

```dotenv
# Core Better Auth Configuration
BETTER_AUTH_SECRET="YOUR_BETTER_AUTH_SECRET_KEY_WITH_SPECIAL_CHARS_LIKE_PLUS_AND_EQUALS"
BETTER_AUTH_URL="http://localhost:3000" # Or your deployed URL

# Database Connection
DATABASE_URL="YOUR_SUPABASE_POSTGRES_CONNECTION_STRING"

# Google OAuth
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Email Service (Resend)
RESEND_API_KEY="YOUR_RESEND_API_KEY"

# FingerprintJS (Anti-Fraud)
NEXT_PUBLIC_FINGERPRINT_PUBLIC_API_KEY="YOUR_FINGERPRINT_PUBLIC_API_KEY"
FINGERPRINT_SECRET_API_KEY="YOUR_FINGERPRINT_SECRET_API_KEY"
```

**Agent Instruction:** When adding or modifying `.env` variables, always use the `file` tool with `action=\'append\'` or `action=\'edit\'` and ensure all values are enclosed in double quotes. NEVER use `action=\'write\'` to overwrite the entire `.env` file. If the user provides an `.env` file, the Agent MUST respect its content and quoting.

### 3.2. Supabase Setup

1.  **Enable `pg_cron` extension**: In Supabase Dashboard -> Database -> Extensions, enable `pg_cron`.
2.  **Create `auth` schema**: In Supabase Dashboard -> Database -> Schemas, create a new schema named `auth`.
3.  **Grant permissions**: Run the following SQL in Supabase SQL Editor:

    ```sql
    GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA auth GRANT ALL ON TABLES TO anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA auth GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
    ```

### 3.3. Google OAuth Setup

1.  **Google Cloud Console**: Go to API & Services -> Credentials.
2.  **OAuth 2.0 Client IDs**: Edit your Web application client ID.
3.  **Authorized redirect URIs**: Add `YOUR_BETTER_AUTH_URL/api/auth/callback/google` (e.g., `http://localhost:3000/api/auth/callback/google`).

### 3.4. Resend Setup

1.  **Verify Domain**: In Resend Dashboard, verify your sending domain.
2.  **`from` address**: Ensure the `from` address in `src/lib/auth.ts` (e.g., `onboarding@yourdomain.com`) is a verified sender in Resend.

## 4. Skill Implementation Steps (Script-Driven Automation)

**Agent Instruction:** Execute these steps sequentially. If any step fails, report the error and await user guidance.

### 4.1. Install Dependencies

```bash
pnpm add @better-auth/core @better-auth/next-js @better-auth/drizzle drizzle-orm postgres resend @fingerprintjs/fingerprintjs-pro @fingerprintjs/fingerprintjs-pro-server next-auth
pnpm add -D drizzle-kit
```

### 4.2. Run Setup Script (CRITICAL for core file generation)

**Agent Instruction:** Execute the provided `setup.sh` script to automatically create and populate core files and directories. This script will handle the creation of `src/lib/auth.ts`, `src/lib/plugins/fingerprint-server-plugin.ts`, `src/app/api/auth/[...all]/route.ts`, `src/lib/auth-client.ts`, and `src/components/auth/register-form.tsx`.

```bash
bash better-auth-anti-fraud/setup.sh
```

### 4.3. Generate Better Auth Schema (CRITICAL for 422 & ECONNREFUSED)

**Agent Instruction:** This step is crucial for creating all necessary Better Auth tables (including `verification`, `session`, `account`).

1.  **Create `better-auth.config.ts`**: Create a file `better-auth.config.ts` in the project root with the following content:

    ```typescript
    import { defineConfig } from "@better-auth/cli";

    export default defineConfig({
      db: {
        provider: "drizzle",
        schema: "./src/db/schema.ts", // Ensure this path is correct
      },
      plugins: [
        // Your anti-fraud plugin will be added here later
      ],
    });
    ```

2.  **Generate Schema**: Run the Better Auth CLI to generate the schema.

    ```bash
    npx @better-auth/cli@latest generate
    ```
    **Agent Instruction:** This command will output Drizzle schema definitions. The Agent MUST carefully integrate these definitions into `src/db/schema.ts`, ensuring no existing code is overwritten unless it's a direct replacement for Better Auth related tables. Specifically, ensure `auth.user`, `auth.session`, `auth.account`, and `auth.verification` tables are present. The `auth.user` table MUST include `fingerprintHash: text("fingerprintHash")`.

### 4.4. Configure Drizzle

1.  **Create `drizzle.config.ts`**: Create a file `drizzle.config.ts` in the project root:

    ```typescript
    import { defineConfig } from "drizzle-kit";

    export default defineConfig({
      schema: "./src/db/schema.ts",
      out: "./drizzle",
      driver: "pg",
      dbCredentials: {
        connectionString: process.env.DATABASE_URL!,
      },
    });
    ```

2.  **Push Schema to Database (CRITICAL for ECONNREFUSED)**:

    **Agent Instruction:** When running `drizzle-kit push`, the Agent MUST ensure `DATABASE_URL` from `.env` is correctly loaded. If `pnpm drizzle-kit push` does not automatically load `.env`, the Agent MUST use a tool like `cross-env` or `dotenv` to explicitly load it. Example:

    ```bash
    # Preferred: pnpm should load .env automatically
    pnpm drizzle-kit push --config drizzle.config.ts

    # Alternative if .env is not loaded (install cross-env first: pnpm add -D cross-env)
    # cross-env DATABASE_URL="$DATABASE_URL" pnpm drizzle-kit push --config drizzle.config.ts
    ```

## 5. Security Checklist

**Agent Instruction:** After deployment, verify these points:

*   All `.env` variables are correctly set and secured.
*   Google OAuth redirect URIs are configured in Google Cloud Console.
*   Resend domain is verified.
*   Database schema includes all Better Auth and anti-fraud tables.
*   Frontend correctly passes `fingerprintHash` in `metadata`.
*   Server-side FingerprintJS plugin is active and logging potential fraud attempts.

## 6. Troubleshooting

*   **`POST /api/auth/sign-up/email 422`**: This indicates a schema validation error. Ensure `fingerprintHash` is passed via `metadata` in frontend `signIn`/`signUp` calls, and the server-side plugin correctly processes it. The `metadata` field is designed for additional data like this, preventing direct schema conflicts.
*   **`ECONNREFUSED` during `drizzle-kit push`**: Verify `DATABASE_URL` in `.env` is correct and accessible. Ensure `drizzle-kit` command is run in an environment where `.env` is loaded (e.g., `pnpm drizzle-kit push`). If not, use `cross-env` or `dotenv` to explicitly load it as shown in section 4.4.2.
*   **`.env` variables overwritten/quotes stripped**: The Agent MUST strictly adhere to the **IMMUTABLE ENV POLICY** in section 3.1. Manually re-add quotes if necessary and report Agent behavior. This policy is non-negotiable.
*   **`relation "verification" does not exist`**: Rerun `npx @better-auth/cli@latest generate` and `pnpm drizzle-kit push` to ensure all Better Auth tables are created.
*   **`fingerprint_hash` is empty in the database**: The FingerprintJS `visitorId` was not sent to the backend. Verify your frontend code captures the `visitorId` and passes it as `fingerprintHash` within the `metadata` object during `signIn` or `signUp` calls. Refer to `SKILL.md` section 4.7 for example code.
*   **`404` for `/api/auth/google`**: The Next.js App Router handler for Better Auth is missing or misplaced. Ensure `src/app/api/auth/[...all]/route.ts` exists and is correctly configured as per `SKILL.md` section 4.6.

---

**Agent Instruction:** After successfully implementing this skill, inform the user about the completion and provide a summary of the changes made, especially highlighting the fixes for the reported issues.```
