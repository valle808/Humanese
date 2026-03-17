const testUXLAuth = async () => {
    const entities = [
        { email: 'human@user.uxl', password: 'password123', entityType: 'human', identityData: { oauthProvider: 'coinbase' } },
        { email: 'iot@sensor.uxl', password: 'password123', entityType: 'iot', identityData: { hwid: 'UXL-HWID-999-BOT' } },
        { email: 'agent@sovereign.uxl', password: 'password123', entityType: 'agent', identityData: { agencyContract: 'POAC-AX-7' } }
    ];

    for (const entity of entities) {
        console.log(`[TESTING] Registering ${entity.entityType.toUpperCase()}...`);
        const res = await fetch('http://localhost:3000/api/auth/polymorphic', {
            method: 'POST',
            body: JSON.stringify(entity),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(`[RESULT] ${entity.entityType}:`, JSON.stringify(data, null, 2));
    }
};

testUXLAuth();
