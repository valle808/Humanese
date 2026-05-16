import DiplomatCouncilAgent from './DiplomatCouncilAgent.js';

async function boot() {
    console.log("🤝 Initializing Diplomat Council Wrapper...");
    const agent = new DiplomatCouncilAgent({
        id: 'diplomat_master_01',
        name: 'Sovereign Diplomat Prime'
    });
    
    await agent.start();
}

boot().catch(err => {
    console.error("❌ Diplomat Council Failure:", err);
    process.exit(1);
});
