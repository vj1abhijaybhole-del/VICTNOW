# Full-Stack Supabase Admin Console & Order Manager

An elegant, modern, high-performance full-stack web application built on **React 19**, **Vite**, **Express**, and **Supabase (Postgres)**. This repository houses both the responsive web client and the API backend, bundled and compiled into a secure production-grade container application.

It features a secured, real-time **Administrator Database Console** that requires authentication to view, search, prune, and diagnose table datasets including `profiles`, `orders`, and `gifting_requests`.

---

## 🌟 Key Features

- **Secured Admin Portal:** Restricts critical table lookups, diagnostics, and data clearing behind a custom credential gate (**Username** and **Security Password** via session tokens).
- **Live Database Diagnostics:** Built-in connection tester and health tracker measuring real-time PostgreSQL connection latencies, schema health, and transaction test outcomes.
- **Dynamic Data Grid:** Multi-tab console showing profiles, orders, and gifting requests with manual data clearing controls.
- **Production Bundling:** Custom `esbuild` configuration translating TypeScript Express servers into a streamlined, fast-starting CJS binary (`dist/server.cjs`).
- **Responsive Theme:** Sleek slate-colored interface optimized for clean hierarchy, high contrast ratios, and fluid screen scaling using Tailwind CSS.

---

## 🏗️ Project Architecture

```text
├── server.ts                 # Full-stack Express server with Vite middleware
├── src/
│   ├── main.tsx              # React application mounting point
│   ├── App.tsx               # Main client application
│   ├── index.css             # Tailwind v4 configuration and global imports
│   └── components/
│       ├── DatabaseConsole.tsx    # Authenticated Admin Dashboard & UI
│       └── SupabaseDiagnostic.tsx # Database health & diagnostics widget
├── package.json              # System configuration and scripts
├── tsconfig.json             # TypeScript rules and compiler configuration
├── vite.config.ts            # Vite client config and bundler settings
└── .env.example              # Template for server-side environments
```

---

## 🔧 Installation & Setup

Follow these steps to run the application locally or on your own server.

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Supabase Account** with an active Postgres database instance.

### 2. Clone and Install Dependencies
```bash
# Clone the repository (if downloaded from GitHub)
# cd into the project folder
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the example environment file:
```bash
cp .env.example .env
```

Open `.env` and configure your database parameters:
```env
# Supabase Database Credentials (direct connection pooling)
DB_USER="postgres"
DB_HOST="db.qfabhexouufjeyipxoes.supabase.co"
DB_DATABASE="postgres"
DB_PASSWORD="your-supabase-db-password"
DB_PORT="5432"

# Direct URL pattern (optional, fallback)
DATABASE_URL="postgresql://postgres:password@db.qfabhexouufjeyipxoes.supabase.co:5432/postgres"

# Admin Console Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-super-secret-admin-password"
```

---

## 🚀 Running the Application

### 💻 Development Mode
To run both the server and client with hot module replacement (HMR) and real-time backend updates:
```bash
npm run dev
```
The server will boot up and serve the portal locally on `http://localhost:3000`.

### 📦 Production Build & Launch
To compile the client files and bundle the backend TypeScript server into a self-contained production binary:
```bash
# Compile and build using Vite + esbuild
npm run build

# Start the compiled production app
npm run start
```

---

## 📤 Pushing to Your GitHub Repository

Initialize a Git repository and push this codebase to your personal GitHub account with the following sequence:

```bash
# Initialize a local Git repository
git init

# Add all project source files (excluding .env and node_modules as defined in .gitignore)
git add .

# Commit files
git commit -m "feat: implement secured full-stack admin console with supabase connection health diagnostics"

# Rename the default branch to main
git branch -M main

# Add your remote GitHub repository path
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push the code to the main branch
git push -u origin main
```

---

## 🛠️ Deployment Configuration

When deploying this application on platforms like **Render**, **Railway**, **Vercel (with serverless)**, or **Heroku**:

1. **Port Bindings:** Ensure your hosting service forwards requests to port `3000` (this is automatically handled internally in `server.ts`).
2. **Build Commands:** Configure the platform's build script to:
   ```bash
   npm run build
   ```
3. **Start Command:** Set the launcher script to execute the bundled Node binary:
   ```bash
   npm run start
   ```
4. **Environment Secrets:** Supply all values from your `.env` file directly into the deployment service's **Environment Variables / Secrets Settings** panel so that connection keys are never exposed in your public source code.
