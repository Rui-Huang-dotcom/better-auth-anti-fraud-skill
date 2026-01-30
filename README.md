# Better Auth Anti-Fraud Skill 🛡️

A professional-grade Agent Skill designed to inject a secure, anti-fraud authentication layer into any Next.js/React project. This skill combines the power of **Better Auth** with **Threshold-based Device Fingerprinting** to block multi-account abuse effectively.

## 🌟 Key Features

- **Official Better Auth Integration**: Uses the official CLI for 100% accurate database schema generation.
- **Anti-Fraud Engine**: Threshold-based device fingerprinting (powered by FingerprintJS) to detect and limit multiple accounts per device.
- **Secure Email Flow**: Mandatory email verification and password reset via **Resend**.
- **Social Login**: Pre-configured Google OAuth support.
- **Modern UI**: Sleek, responsive authentication pages built with **Shadcn UI** and **Tailwind CSS**.
- **Agent-Optimized**: Specifically designed to be deployed by AI agents (like Antigravity) with strict configuration rules.

## 🛠️ Tech Stack

- **Auth**: [Better Auth](https://better-auth.com)
- **Database**: [Drizzle ORM](https://orm.drizzle.team) + [Supabase (PostgreSQL)](https://supabase.com)
- **Email**: [Resend](https://resend.com)
- **Fingerprinting**: [FingerprintJS](https://fingerprintjs.com)
- **UI**: React + Next.js + Shadcn UI

## 🚀 Quick Start (for Agents)

If you are using an AI agent to deploy this skill, ensure it follows the `SKILL.md` instructions:

1. **Install Dependencies**:
   ```bash
   npm install better-auth drizzle-orm resend @fingerprintjs/fingerprintjs lucide-react
   ```
2. **Generate Schema**:
   ```bash
   npx @better-auth/cli@latest generate --output src/db/auth-schema.ts
   ```
3. **Sync Database**:
   ```bash
   npx drizzle-kit push
   ```

## ⚙️ Environment Variables

**CRITICAL**: All values MUST be wrapped in double quotes to prevent parsing errors.

```env
# Better Auth Core
BETTER_AUTH_SECRET="your_32_char_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="postgres://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres"

# OAuth & Email
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
RESEND_API_KEY="re_your_resend_key"
```

## 🔍 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **500 Error (Relation "verification" missing)** | Run `npx @better-auth/cli generate` and then `npx drizzle-kit push`. |
| **400/500 Error (Google Login)** | Ensure `BETTER_AUTH_URL` is set correctly and matches your Google Cloud Console redirect URI. |
| **Quotes missing in .env** | Manually wrap values in `""`. The Skill now enforces this for Agents. |
| **Email not sending** | Verify your domain in Resend or use `onboarding@resend.dev` for testing. |

## 📄 License

MIT © 2026 Better Auth Anti-Fraud Team
