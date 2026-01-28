---
name: better-auth-anti-fraud
description: A professional Agent Skill to inject a secure, anti-fraud authentication layer into any Next.js/React project. It automates the setup of Better Auth, Drizzle ORM, Resend (with email verification), and Threshold-based Device Fingerprinting to block multi-account abuse.
---

# Better Auth Anti-Fraud Skill: The Ultimate Auth Hub

This skill transforms a basic authentication setup into a professional-grade, anti-fraud system. It guides the Agent to implement threshold-based device fingerprinting, email verification via Resend, Google OAuth, and a sleek Shadcn UI.

## 1. When to Use This Skill

- When upgrading a basic auth starter (like Vercel's Drizzle starter) to include anti-fraud measures.
- When implementing "Register with Google" or "Email + Password" with mandatory email verification.
- When the user wants a modern, Shadcn UI-based authentication interface.

## 2. Implementation Workflow

### Step 2.1: Environment & Dependencies
1. **Install Packages**: Ensure `better-auth`, `drizzle-orm`, `resend`, `@fingerprintjs/fingerprintjs`, and `lucide-react` are installed.
2. **Shadcn UI**: If not already installed, the Agent should guide the user to install necessary components (Button, Input, Card, Form) using `npx shadcn-ui@latest add`.

### Step 2.2: Database Schema Extension
The Agent MUST extend the user table in the Drizzle schema (e.g., `src/db/schema.ts`) to support anti-fraud and verification features.

- **Action**: Inject the code from `<reference>resources/schema-snippet.ts</reference>` into the user table definition.
- **Fields Added**: `fingerprintHash` (text), `emailVerified` (boolean).

### Step 2.3: Better Auth Configuration (`src/auth.ts`)

The Agent MUST create or modify the Better Auth configuration file (e.g., `src/auth.ts`) to include all features.

#### 2.3.1. Core Configuration
- **Action**: Configure the core `betterAuth` instance.
- **Key Settings**:
    - `database`: Use `drizzleAdapter` pointing to the user's `db` instance.
    - `emailAndPassword`: Set `requireEmailVerification: true`.
    - `secret`: Use `process.env.BETTER_AUTH_SECRET!`.
    - `plugins`: Include the anti-fraud plugin: `<reference>resources/plugin-logic.ts</reference>`.

#### 2.3.2. Email Verification & Resend
- **Action**: Configure `emailVerification` to use Resend.
- **Key Settings**:
    - Set `sendVerificationEmail` to use the custom React Email template from `<reference>resources/email-templates.tsx</reference>`.
    - **Resend Domain Tip**: The Agent MUST remind the user that the `from` address must be a verified domain in Resend (e.g., `support@nanobananapro.tech`). For local testing, the user can temporarily use a test email like `onboarding@resend.dev`.

#### 2.3.3. Password Reset Flow
- **Action**: Configure `passwordReset` and set a minimum password length.
- **Key Settings**:
    - Set `sendPasswordResetEmail` to use the custom React Email template from `<reference>resources/email-templates.tsx</reference>`.
    - Set `minPasswordLength: 8` for basic security.

#### 2.3.4. **Google OAuth and Social Providers (NEW)**
- **Action**: Configure `socialProviders` to include Google.
- **Key Settings**:
    - The Agent MUST ensure the following environment variables are present: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
    - **Code Snippet**:
      ```typescript
      socialProviders: {
          google: {
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
          // User can add other providers here (e.g., github, discord)
      },
      ```

### Step 2.4: Frontend Implementation

The Agent MUST create the necessary frontend pages, following the standard Next.js App Router structure (`app/auth/[page]/page.tsx`).

- **Action**: Create the following pages using the provided examples:
    - **Registration**: Use `<reference>examples/shadcn-register-form.tsx</reference>`. The Agent MUST ensure the form includes the device fingerprint collection logic.
    - **Forgot Password**: Use `<reference>examples/forgot-password-form.tsx</reference>`.
    - **Reset Password**: Use `<reference>examples/reset-password-form.tsx</reference>`.
    - **Login**: The Agent should create a standard login form, ensuring it has a "Continue with Google" button that links to the social login endpoint.

## 3. Configuration Guides

### 3.1. Supabase Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Project Settings** > **Database**.
3. Copy the **Connection String** (URI). Ensure you use the `Transaction` mode (port 6543) for serverless environments like Vercel.
4. Add to `.env`: `DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres"`

### 3.2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Create an **OAuth client ID** (Application type: Web application).
5. **Authorized redirect URIs**: Add `http://localhost:3000/api/auth/callback/google` (and your production domain).
6. Add the credentials to `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

### 3.3. Resend API Key
1. Create an account at [Resend](https://resend.com/).
2. Create an API Key with **Send emails** permission.
3. Add the key to `.env`:
   ```
   RESEND_API_KEY=...
   ```

## 4. References

- `<reference>resources/plugin-logic.ts</reference>`: Threshold-based anti-fraud plugin logic.
- `<reference>resources/schema-snippet.ts</reference>`: Drizzle schema extension for fingerprint and verification.
- `<reference>resources/email-templates.tsx</reference>`: React Email templates for verification and password reset.
- `<reference>examples/shadcn-register-form.tsx</reference>`: Registration form with fingerprint collection.
- `<reference>examples/forgot-password-form.tsx</reference>`: Forgot password form.
- `<reference>examples/reset-password-form.tsx</reference>`: Reset password form.
