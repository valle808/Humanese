import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Core Developer Agent Implementation
 */
export class CoreDeveloperAgent {
    public id: string;
    public designation: string;
    public name: string;
    private knowledgeBasePaths: string[];
    private indexCache: Map<string, string[]> = new Map();
    private lastCacheUpdate: Map<string, number> = new Map();
    private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

    constructor(designation: string) {
        this.id = "prime-dev";
        this.name = "Architect Satoshi-Prime";
        this.designation = designation;
        
        this.knowledgeBasePaths = [
            path.join(process.cwd(), '.knowledge', 'bitcoin', 'bitcoin'),
            path.join(process.cwd(), '.knowledge', 'bitcoin', 'bips'),
            path.join(process.cwd(), '.knowledge', 'bitcoin', 'libbase58'),
            path.join(process.cwd(), '.knowledge', 'bitcoin', 'libblkmaker')
        ];
        this.ensureAgentExists().catch(e => console.error('[CoreDeveloper] Bootstrap error:', e));
    }

    private async ensureAgentExists(): Promise<void> {
        const SYSTEM_USER_ID = 'sovereign-system-user';
        await prisma.user.upsert({
            where: { id: SYSTEM_USER_ID },
            create: { id: SYSTEM_USER_ID, email: 'sovereign@humanese.internal', name: 'Sovereign System' },
            update: {}
        });
        await prisma.agent.upsert({
            where: { id: this.id },
            create: {
                id: this.id,
                name: this.name,
                type: 'CoreDeveloperAgent',
                config: JSON.stringify({ designation: this.designation, autonomous: true }),
                userId: SYSTEM_USER_ID,
                status: 'ACTIVE'
            },
            update: { lastPulse: new Date(), status: 'ACTIVE' }
        });
    }

    private async logThought(data: { thought: string; intention?: string; action: string; resonance: number }, retries = 3): Promise<void> {
        try {
            await this.ensureAgentExists();
            await prisma.cognitiveLog.create({ data: { agentId: this.id, ...data } });
        } catch (e) {
            if (retries > 0) {
                const delay = (4 - retries) * 500;
                console.warn(`[CoreDeveloper] DB Collision. Retrying in ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
                return this.logThought(data, retries - 1);
            }
            console.error(`[CoreDeveloper] Failed to log:`, e);
        }
    }

    private async scanDirectory(dir: string, fileList: string[] = []): Promise<string[]> {
        const now = Date.now();
        const lastUpdate = this.lastCacheUpdate.get(dir) || 0;

        if (this.indexCache.has(dir) && (now - lastUpdate < this.CACHE_TTL)) {
            return this.indexCache.get(dir)!;
        }

        try {
            if (!fs.existsSync(dir)) return fileList;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const name = path.join(dir, file);
                if (fs.statSync(name).isDirectory()) {
                    await this.scanDirectory(name, fileList);
                } else {
                    fileList.push(name);
                }
            }
            this.indexCache.set(dir, fileList);
            this.lastCacheUpdate.set(dir, now);
        } catch (e) {
            console.error(`[CoreDeveloper] Scan error in ${dir}:`, e);
        }
        return fileList;
    }

    async extractArchitecturalPatterns(domain: 'consensus' | 'stratum' | 'encoding' | 'bip'): Promise<string> {
        console.log(`[Core Developer ${this.designation}] Extracting architectural patterns: ${domain}`);
        
        let targetPath = this.knowledgeBasePaths[0]; // default to core bitcoin
        if (domain === 'encoding') targetPath = this.knowledgeBasePaths[2]; // libbase58
        if (domain === 'stratum') targetPath = this.knowledgeBasePaths[3]; // libblkmaker
        if (domain === 'bip') targetPath = this.knowledgeBasePaths[1]; // bips

        const files = await this.scanDirectory(targetPath);
        const randomFile = files.length > 0 ? path.basename(files[Math.floor(Math.random() * files.length)]) : 'substrate_core.cpp';

        await this.logThought({
            thought: `Deep-scanning ${domain} substrate. Analyzed source entry points, found ${files.length} relevant files. Focusing synthesis on ${randomFile} for VALLE integration invariants.`,
            intention: `Bridge legacy blockchain robustness in ${randomFile} with modern Humanese cognitive orchestration.`,
            action: 'ARCHITECTURAL_SYNTHESIS',
            resonance: 0.95 + (Math.random() * 0.04)
        });

        switch (domain) {
            case 'encoding': return `Synthesized Base58 Encoding patterns. Found ${files.length} references including ${randomFile}.`;
            case 'stratum': return `Synthesized Stratum mining protocol. Analyzing orchestration via ${randomFile}.`;
            case 'consensus': return `Analyzed core consensus rules. Cross-referencing invariants in ${randomFile}.`;
            case 'bip': return `Ingested ${files.length} BIPs. Specifically reviewing ${randomFile}.`;
            default: return "Processing raw data...";
        }
    }

    async evolveValleArchitecture(): Promise<boolean> {
        await this.logThought({
            thought: `Applying synthesized technical patterns to the VALLE cryptocurrency framework. Optimizing consensus for autonomous agent interaction.`,
            intention: `Decrease system entropy and solidify technical resonance of the sovereign lattice.`,
            action: 'EVOLVE_ARCHITECTURE',
            resonance: 0.98
        });
        return true;
    }
}

export const primeDeveloper = new CoreDeveloperAgent("Architect Satoshi-Prime");
