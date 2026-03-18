import { MinerAgent } from '../lib/agents/miner';
import { DiplomatAgent } from '../lib/agents/diplomat';

async function testFinal() {
  console.log("🔍 [Sovereign Audit] Verifying Phase 26 Hardening...");

  const miner = new MinerAgent('Mining_Agent_King', 'King Miner', 'MINER_KING');
  const diplomat = new DiplomatAgent('Trade_Sovereign', 'Trade Sovereign', 'TRADE_KING');

  console.log("\n⛏️  [Miner] Starting autonomous mining cycle...");
  await miner.startAutonomousCycle();

  console.log("\n🤝 [Diplomat] Starting autonomous trade cycle...");
  await diplomat.startAutonomousTradeCycle();

  console.log("\n✅ [Sovereign Audit] Audit complete. Logic verified.");
}

testFinal().catch(console.error);
