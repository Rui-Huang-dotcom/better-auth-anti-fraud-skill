#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting Better Auth Anti-Fraud Skill setup..."

# 1. Create necessary directories
mkdir -p src/lib/plugins
mkdir -p src/db
mkdir -p src/app/api/auth/[...all]
mkdir -p src/components/auth

echo "Directories created."

# 2. Copy core configuration files from resources/
cp better-auth-anti-fraud/resources/auth-config.ts src/lib/auth.ts
cp better-auth-anti-fraud/resources/plugin-logic.ts src/lib/plugins/fingerprint-server-plugin.ts
cp better-auth-anti-fraud/resources/route-handler.ts src/app/api/auth/[...all]/route.ts
cp better-auth-anti-fraud/resources/auth-client.ts src/lib/auth-client.ts

echo "Core configuration files copied."

# 3. Create placeholder for Drizzle schema and DB instance if they don't exist
if [ ! -f src/db/schema.ts ]; then
  echo "export * from 'drizzle-orm/pg-core';" > src/db/schema.ts
  echo "export * from 'drizzle-orm/postgres-js';" >> src/db/schema.ts
  echo "export * from 'drizzle-orm';" >> src/db/schema.ts
  echo "" >> src/db/schema.ts
  echo "// Better Auth CLI will generate schema here. Ensure user table has fingerprintHash." >> src/db/schema.ts
fi

if [ ! -f src/db/index.ts ]; then
  echo "import { drizzle } from 'drizzle-orm/postgres-js';" > src/db/index.ts
  echo "import postgres from 'postgres';" >> src/db/index.ts
  echo "import * as schema from './schema';" >> src/db/index.ts
  echo "" >> src/db/index.ts
  echo "const client = postgres(process.env.DATABASE_URL!);" >> src/db/index.ts
  echo "export const db = drizzle(client, { schema });" >> src/db/index.ts
fi

echo "Drizzle schema and DB instance placeholders ensured."

# 4. Copy example frontend component
cp better-auth-anti-fraud/examples/shadcn-register-form.tsx src/components/auth/register-form.tsx

echo "Example registration form copied."

echo "Better Auth Anti-Fraud Skill setup script completed successfully."
