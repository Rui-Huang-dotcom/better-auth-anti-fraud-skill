# 🛡️ Better Auth Anti-Fraud Skill

## 🚀 The Anti-Multi-Account Layer for Modern Web Apps

The **Better Auth Anti-Fraud Skill** is a professional-grade Agent Skill designed to inject a robust, server-side anti-fraud mechanism into your project. It's built for developers who want to secure their applications against multi-account abuse using a modern, type-safe stack.

### 🎯 Core Innovation: Device Fingerprinting Plugin

This Skill implements a custom **Better Auth Server Plugin** that uses **Device Fingerprinting** to block repeat registrations from the same device.

| Component | Role |
| :--- | :--- |
| **Skill Name** | `better-auth-anti-fraud` |
| **Core Logic** | Custom Better Auth Plugin |
| **Database** | Drizzle ORM (Single Table) |
| **Anti-Fraud Tech** | `@fingerprintjs/fingerprintjs` |

### 🛠️ How to Install and Use

#### 1. Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/your-username/better-auth-anti-fraud.git
```

#### 2. Add to Your Project
Copy the `better-auth-anti-fraud` folder into your project's Agent skill directory:
*   **Antigravity/Claude**: `.agent/skills/better-auth-anti-fraud/`

#### 3. Activate the Skill
In your project root, ask your Agent:
> **Agent Prompt:** "Using the local skill in `.agent/skills/better-auth-anti-fraud`, please integrate the device fingerprinting anti-fraud layer into my project. Use Shadcn UI for the forms."

### 📂 Skill Structure

```
better-auth-anti-fraud/
├── SKILL.md                          # Main instructions for the Agent
├── package.json                      # Skill metadata
├── resources/                        # Core code snippets
│   ├── plugin-logic.ts               # Better Auth Plugin code
│   ├── schema-snippet.ts             # Drizzle schema extension
│   └── email-templates.tsx           # React email templates
├── examples/                         # Reference implementations
│   ├── shadcn-register-form.tsx      # Registration form
│   ├── forgot-password-form.tsx      # Forgot password form
│   └── reset-password-form.tsx       # Reset password form
└── scripts/
    └── setup.sh                      # Dependency installation script
```

---
**License**: MIT
