---
name: better-auth-anti-fraud
description: A high-performance Agent Skill to inject a secure, anti-fraud authentication layer into any Next.js/React project. It automates the setup of Better Auth, Drizzle ORM, Resend (with email verification & password reset), and Threshold-based Device Fingerprinting.
---

# Better Auth Anti-Fraud Skill: The Ultimate Auth Wizard

This skill transforms a basic authentication setup into a professional-grade, anti-fraud system. It guides the Agent to implement device fingerprinting, email verification, password reset flows, and sleek Shadcn UI components.

## 1. When to Use This Skill

- When upgrading a basic auth starter to include anti-fraud measures.
- When implementing "Register with Google" or "Email + Password" with mandatory email verification.
- When adding "Forgot Password" and "Reset Password" functionality with professional email templates.

## 2. Implementation Workflow

### Step 2.1: Environment & Dependencies
1. **Install Packages**: `better-auth`, `drizzle-orm`, `resend`, `@fingerprintjs/fingerprintjs`, `lucide-react`.
2. **Shadcn UI**: Add `button`, `input`, `card`, `label`, `toast`.
3. **Env Vars**: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `AUTH_EMAIL_FROM`.

### Step 2.2: Schema & Plugin Setup
1. **Schema**: Update `user` table using `resources/schema-snippet.ts`. (Note: Fingerprint is NOT unique to allow for threshold-based blocking).
2. **Plugin**: Create `src/auth/plugins/anti-fraud.ts` using `resources/plugin-logic.ts`.

### Step 2.3: Better Auth Configuration (Email & Security)
1. **Email Templates**: Create `src/auth/email-templates.tsx` using `resources/email-templates.tsx`.
2. **Auth Config**: In `src/auth/config.ts`:
   - Enable `emailVerification` and `passwordReset`.
   - Set `minPasswordLength: 8` for security.
   - Use the imported templates in `sendVerificationEmail` and `sendResetPassword`.
   - Add `antiFraudPlugin({ threshold: 3 })` to the `plugins` array.

### Step 2.4: UI Components (Directory Structure)
The Agent should create the following directory structure under `app/auth/`:
- `app/auth/login/page.tsx`: Login form.
- `app/auth/register/page.tsx`: Use `examples/shadcn-register-form.tsx`.
- `app/auth/forgot-password/page.tsx`: Use `examples/forgot-password-form.tsx`.
- `app/auth/reset-password/page.tsx`: Use `examples/reset-password-form.tsx`.

## 3. Configuration Wizard

### 3.1. Resend Domain Verification
- **Development**: Use `onboarding@resend.dev` as the `AUTH_EMAIL_FROM`.
- **Production**: Verify your domain at [Resend Domains](https://resend.com/domains) and set `AUTH_EMAIL_FROM="support@yourdomain.com"`.

### 3.2. Anti-Fraud Philosophy (Threshold Strategy)
In a real-world scenario, a single fingerprint might be shared (e.g., library computers, families). This skill uses a **Threshold Strategy** (default: 3 accounts per device). This prevents mass bot registration while minimizing false positives for legitimate users.

## 4. References

- **Email Templates**: [resources/email-templates.tsx](./resources/email-templates.tsx)
- **Reset Password Form**: [examples/reset-password-form.tsx](./examples/reset-password-form.tsx)
- **Forgot Password Form**: [examples/forgot-password-form.tsx](./examples/forgot-password-form.tsx)
- **Schema Extension**: [resources/schema-snippet.ts](./resources/schema-snippet.ts)
- **Plugin Logic**: [resources/plugin-logic.ts](./resources/plugin-logic.ts)
- **Shadcn Form Example**: [examples/shadcn-register-form.tsx](./examples/shadcn-register-form.tsx)
- **Setup Script**: [scripts/setup.sh](./scripts/setup.sh)
