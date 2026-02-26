# ⚙️ Humanese Installation Guide

Welcome to the meticulous setup guide for the Humanese platform. Given the complexity of local servers, autonomous agents, and database infrastructures, please follow these steps exactly to ensure absolute system stability.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Operating System**: Windows 10/11 (Preferred), macOS, or Linux.
2. **Node.js**: Version 18 LTS or higher. (Recommended: v22 LTS for Automaton compatibility).
3. **Git**: Latest version installed and configured.
4. **XAMPP / Relational Database**: Required for setting up local MySQL/MariaDB for the ecosystem. XAMPP is highly recommended for Windows users.
5. **A Code Editor**: Visual Studio Code (VS Code) is recommended.

---

## 🚀 Step 1: Clone and Position the Repository

If you haven't already extracted the platform, you must place it correctly within your local server environment.

1. Navigate to your local web server's core directory (e.g., `C:\xampp\htdocs\`).
2. Clone the repository into a folder named `humanese`:

   ```bash
   git clone https://github.com/valle808/ULM---Universal_Language_Model.git humanese
   ```

3. Open the directory in your terminal:

   ```bash
   cd humanese
   ```

---

## 📦 Step 2: Install Node.js Dependencies

The ecosystem relies on several heavy packages for authentication, web serving, and database management.

1. Ensure you are in the project root: `C:\xampp\htdocs\humanese`
2. Run the Node Package Manager install command:

   ```bash
   npm install
   ```

   *This will resolve all dependencies listed in `package.json`, including Express, Prisma, bcryptjs, and JSONWebToken.*

---

## 🗄️ Step 3: Database Database configuration

Humanese uses **Prisma** to manage its database schemas safely.

1. Start your **Apache** and **MySQL** instances from the XAMPP Control Panel.
2. Open your browser and navigate to `http://localhost/phpmyadmin`.
3. Create a new, empty database named `humanese` (or whatever matches your config).
4. **Environment Variables**: Open the `.env` file in the root directory (create one if it doesn't exist by copying `.env.example`). Edit the `DATABASE_URL` string to point to your new database:

   ```env
   DATABASE_URL="mysql://root:@localhost:3306/humanese"
   PORT=3000
   ```

5. Apply the schemas using Prisma:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

---

## 🏃 Step 4: Starting the System

Once your database is fully structured and dependencies are fetched, you are ready to initiate the local environment.

1. Start the unified Humanese Backend Server:

   ```bash
   npm run dev
   ```

   *(This uses `nodemon` to allow hot-reloading if you decide to edit server files).*

2. The server should log that it is listening on port `3000` (or your defined port).
3. Open your browser and navigate directly to:

   ```text
   http://localhost/humanese/index.html
   ```

---

## 🔧 Step 5: Verify the Ecosystem

It's critical to verify that all interconnected agents and remote repos are structured properly.

We have included an automated health check protocol for validation. Run in a separate terminal:

```bash
node scripts/repo_check.js
```

*If everything reports "Working tree clean" or specifies your active remotes, your environment is perfect.*

## 🎉 Conclusion

Welcome to Humanese. Proceed to the [User Manual](USER_MANUAL.md) to learn how to operate the administrative gateways and agent swarms.
