#!/bin/bash

# scripts/setup.sh
# Helper script to install necessary dependencies for the Anti-Fraud Skill.

echo "Installing core dependencies for Better Auth Anti-Fraud Skill..."

# Core dependencies
npm install better-auth better-auth-client drizzle-orm postgres @supabase/supabase-js resend

# Device Fingerprinting
npm install @fingerprintjs/fingerprintjs

# Development dependencies
npm install -D drizzle-kit typescript

echo "Dependencies installed successfully. Next, configure your .env file and run Drizzle migrations."
