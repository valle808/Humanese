const userId = localStorage.getItem('humanese_userId');

document.addEventListener('DOMContentLoaded', () => {
    if (!userId) {
        alert('Please login to manage API keys');
        window.location.href = '/auth.html';
        return;
    }
    loadKeys();
});

async function loadKeys() {
    try {
        const response = await fetch(`/api/keys?userId=${userId}`);
        const keys = await response.json();

        const list = document.getElementById('keys-list');
        list.innerHTML = '';

        if (keys.length === 0) {
            list.innerHTML = '<p style="color: grey;">No active keys found.</p>';
            return;
        }

        keys.forEach(key => {
            const el = document.createElement('div');
            el.className = 'key-item';
            el.innerHTML = `
                <div class="key-info">
                    <h4>${key.name}</h4>
                    <p>Created: ${new Date(key.createdAt).toLocaleDateString()}</p>
                    <p>Last used: ${key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</p>
                </div>
                <button class="danger" onclick="deleteKey('${key.id}')">Revoke</button>
            `;
            list.appendChild(el);
        });
    } catch (error) {
        console.error('Error loading keys:', error);
    }
}

window.showKeyModal = () => {
    document.getElementById('key-modal').classList.remove('hidden');
    document.getElementById('generated-key-display').classList.add('hidden');
};

window.hideKeyModal = () => {
    document.getElementById('key-modal').classList.add('hidden');
};

window.createKey = async () => {
    const name = document.getElementById('new-key-name').value;
    if (!name) return alert('Key name is required');

    try {
        const response = await fetch('/api/keys/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, name })
        });
        const result = await response.json();

        if (result.success) {
            document.getElementById('generated-key-display').classList.remove('hidden');
            document.getElementById('raw-key-value').innerText = result.apiKey;
            loadKeys();
        }
    } catch (error) {
        console.error('Error creating key:', error);
    }
};

window.copyKey = () => {
    const key = document.getElementById('raw-key-value').innerText;
    navigator.clipboard.writeText(key);
    alert('Key copied!');
};
