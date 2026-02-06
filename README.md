# Better Auth Anti-Fraud Skill: The Ultimate Auth Hub

This skill transforms a basic authentication setup into a professional-grade, anti-fraud system. It leverages the official Better Auth CLI for schema generation and adds a custom anti-fraud layer.

## 1. Features

*   **Automated Setup**: Integrates Better Auth, Drizzle ORM, and Resend into your Next.js project.
*   **Anti-Fraud Protection**: Implements device fingerprinting with FingerprintJS to detect and prevent multi-account abuse.
*   **Official CLI Integration**: Uses `@better-auth/cli` to ensure accurate and complete database schema generation.
*   **Secure by Default**: Enforces best practices for environment variable handling and security configurations.

## 2. Quick Start (Script-Driven Automation)

This skill now uses a `setup.sh` script to automate most of the file creation and integration. Follow these steps:

1.  **Initialize Your Project**: Start with a fresh Next.js project.
    ```bash
    npx create-next-app@latest my-auth-app --typescript --tailwind --eslint
    cd my-auth-app
    ```
2.  **Configure Environment**: Create a `.env` file in your project root and add your credentials. **CRITICAL: All values MUST be wrapped in double quotes, and the Agent MUST NOT strip existing quotes.**
    ```dotenv
    BETTER_AUTH_SECRET="YOUR_BETTER_AUTH_SECRET_KEY_WITH_SPECIAL_CHARS_LIKE_PLUS_AND_EQUALS"
    BETTER_AUTH_URL="http://localhost:3000" # Or your deployed URL
    DATABASE_URL="YOUR_SUPABASE_POSTGRES_CONNECTION_STRING"
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
    RESEND_API_KEY="YOUR_RESEND_API_KEY"
    NEXT_PUBLIC_FINGERPRINT_PUBLIC_API_KEY="YOUR_FINGERPRINT_PUBLIC_API_KEY"
    FINGERPRINT_SECRET_API_KEY="YOUR_FINGERPRINT_SECRET_API_KEY"
    ```
3.  **Run the Setup Script**: Copy the `better-auth-anti-fraud` folder (containing `setup.sh`, `SKILL.md`, `resources/`, `examples/`) into your project root. Then, execute the setup script:
    ```bash
    bash better-auth-anti-fraud/setup.sh
    ```
    This script will create all necessary files and directories.
4.  **Install Dependencies**: After running the script, install the required packages:
    ```bash
    pnpm add @better-auth/core @better-auth/next-js @better-auth/drizzle drizzle-orm postgres resend @fingerprintjs/fingerprintjs-pro @fingerprintjs/fingerprintjs-pro-server next-auth
    pnpm add -D drizzle-kit
    ```
5.  **Generate Better Auth Schema**: Create `better-auth.config.ts` in your project root:
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
    Then run the CLI to generate the schema definitions into `src/db/schema.ts`:
    ```bash
    npx @better-auth/cli@latest generate
    ```
    **CRITICAL:** Ensure `auth.user`, `auth.session`, `auth.account`, and `auth.verification` tables are present in `src/db/schema.ts`. The `auth.user` table MUST include `fingerprintHash: text("fingerprintHash")`.
6.  **Configure Drizzle & Push Schema**: Create `drizzle.config.ts` in your project root:
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
    Then push the schema to your database:
    ```bash
    pnpm drizzle-kit push --config drizzle.config.ts
    ```
    **CRITICAL:** Ensure `DATABASE_URL` from `.env` is correctly loaded. If `pnpm drizzle-kit push` does not automatically load `.env`, use `cross-env` or `dotenv` to explicitly load it.

## 3. Troubleshooting Matrix

| Error Code / Symptom | Common Cause | Solution |
| :--- | :--- | :--- |
| **`POST /api/auth/sign-up/email 422`** | Schema Validation Error | This happens when you pass a field (like `deviceFingerprint`) that the default `signUp.email` schema doesn't recognize. **Fix:** Ensure the fingerprint hash is passed inside the `metadata` object in your frontend `signUp` and `signIn` calls. The `examples/shadcn-register-form.tsx` (copied to `src/components/auth/register-form.tsx` by `setup.sh`) provides an example of this. |
| **`ECONNREFUSED` during `drizzle-kit push`** | Database Connection Failure | `drizzle-kit` isn't loading your `.env` file or `DATABASE_URL` is incorrect. **Fix:** Verify `DATABASE_URL` in `.env` is correct and accessible. If the issue persists, ensure `drizzle-kit` command is run in an environment where `.env` is loaded (e.g., `pnpm drizzle-kit push`). If not, use a tool like `cross-env` to explicitly pass the variable as shown in section 2, step 6. |
| **`.env` variables are removed or quotes are stripped** | Agent Over-Correction | The Agent is being too aggressive in cleaning up the `.env` file. **Fix:** The `SKILL.md` now includes an **IMMUTABLE ENV POLICY** (section 3.1) that strictly prohibits the Agent from modifying or stripping quotes from existing `.env` entries. Manually restore your `.env` file and report the Agent's behavior if it persists. |
| **`relation "verification" does not exist`** | Incomplete Database Schema | The core Better Auth tables were not created. **Fix:** The `SKILL.md` now mandates using `npx @better-auth/cli@latest generate` to create the complete schema. Rerun this command and `drizzle-kit push`. |
| **`fingerprint_hash` is empty in the database** | Frontend Data Passing Issue | The FingerprintJS `visitorId` was not sent to the backend. **Fix:** Verify your frontend code captures the `visitorId` and passes it as `fingerprintHash` within the `metadata` object during `signIn` or `signUp` calls. Refer to `src/components/auth/register-form.tsx` for example code. |
| **`404` for `/api/auth/google`** | Missing Route Handler | The Next.js App Router handler for Better Auth is missing or misplaced. **Fix:** Ensure `src/app/api/auth/[...all]/route.ts` exists and is correctly configured as per the `setup.sh` script. |

## 4. Key Implementation Details

*   **Script-Driven Setup**: The `setup.sh` script automates the creation of core files, reducing manual errors and Agent cognitive load.
*   **Schema Generation**: The skill now uses `@better-auth/cli` to generate the base schema, then injects the `fingerprintHash` field into the `user` table.
*   **Environment Policy**: The skill enforces a strict, non-negotiable policy that prevents the Agent from overwriting or stripping quotes from your `.env` file.
*   **Metadata for Custom Fields**: All custom data (like `fingerprintHash`) is passed through the `metadata` object to avoid 422 validation errors.

This version of the skill is designed to be highly resilient against common Agent errors and provide a much smoother deployment experience. If you encounter any further issues, please refer to the troubleshooting matrix or provide the error logs for further analysis.

## 5. License

MIT © 2026 Better Auth Anti-Fraud Team
