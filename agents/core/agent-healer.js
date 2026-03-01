import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * 🛠️ HUMANESE SELF-HEALING AGENT (Agent-Healer)
 * 
 * This autonomous agent monitors the Humanese system for critical errors,
 * analyzes stack traces, and executes automated fixes such as:
 * - Regenerating Prisma schemas
 * - Restarting crashed PM2/Node processes
 * - Clearing corrupt caches
 * - Auto-fixing predictable lint/syntax errors
 */

class AgentHealer {
    constructor() {
        this.logFile = path.resolve(process.cwd(), "healer.log");
        this.errorPatterns = [
            {
                pattern: /Cannot read properties of undefined \(reading 'findFirst'\)/,
                action: () => this.runCommand("npx prisma generate", "Regenerated Prisma Client to fix undefined model."),
            },
            {
                pattern: /EADDRINUSE: address already in use/,
                action: () => this.runCommand("npx kill-port 3000", "Freed up port 3000 from ghost process."),
            }
        ];
    }

    log(message) {
        const entry = `[HEALER] ${new Date().toISOString()} - ${message}\n`;
        console.log(entry.trim());
        fs.appendFileSync(this.logFile, entry);
    }

    runCommand(cmd, successMsg) {
        try {
            this.log(`Executing autonomous fix: ${cmd}`);
            execSync(cmd, { stdio: "pipe" });
            this.log(`Fix Successful: ${successMsg}`);
        } catch (error) {
            this.log(`Fix Failed: ${error.message}`);
        }
    }

    analyzeError(errorMessage) {
        this.log(`Analyzing error: ${errorMessage}`);
        for (const rule of this.errorPatterns) {
            if (rule.pattern.test(errorMessage)) {
                this.log(`Match found for pattern: ${rule.pattern}`);
                rule.action();
                return true;
            }
        }
        this.log("No automated fix available for this error.");
        return false;
    }

    autoHeal(errorObj) {
        try {
            const message = errorObj.stack || errorObj.message || String(errorObj);
            this.analyzeError(message);
        } catch (e) {
            this.log(`Healer encountered internal error: ${e.message}`);
        }
    }
}

export const agentHealer = new AgentHealer();
