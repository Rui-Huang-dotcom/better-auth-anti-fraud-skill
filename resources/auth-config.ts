import { BetterAuth } from "@better-auth/core";
import { DrizzleAdapter } from "@better-auth/drizzle";
import { GoogleProvider } from "@better-auth/core/providers/google";
import { EmailProvider } from "@better-auth/core/providers/email";
import { ResendEmailService } from "@better-auth/resend";
import { antiFraudPlugin } from "./plugin-logic"; // Your custom anti-fraud plugin
import * as schema from "../src/db/schema"; // Your Drizzle schema
import { db } from "../src/db"; // Your Drizzle DB instance

export const auth = new BetterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  adapter: DrizzleAdapter(db, schema),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    }),
    EmailProvider({
      emailService: new ResendEmailService({
        apiKey: process.env.RESEND_API_KEY!,
        from: "onboarding@yourdomain.com", // CHANGE THIS TO YOUR VERIFIED RESEND DOMAIN
      }),
      requireEmailVerification: true,
    }),
  ],
  plugins: [
    antiFraudPlugin(), // Integrate your anti-fraud plugin
  ],
});
