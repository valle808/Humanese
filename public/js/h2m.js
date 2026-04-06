// H2M API Key Manager — Sovereign Protocol
const userId = localStorage.getItem('humanese_userId');

document.addEventListener('DOMContentLoaded', () => {
    if (!userId) {
        showToast('⚠️ Please sign in to manage API keys', 'warning');
        setTimeout(() => { window.location.href = '/auth.html'; }, 1500);
        return;
    }
    loadKeys();
});

async function loadKeys() {
    const list = document.getElementById('keys-list');
    list.innerHTML = '<p class="js-empty-msg">Loading keys...</p>';

    try {
        const response = await fetch(`/api/keys?userId=${userId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const keys = await response.json();

        list.innerHTML = '';

        if (keys.length === 0) {
            list.innerHTML = '<p class="h2m-empty-msg">No active API keys. Create one to get started.</p>';
            return;
        }

        keys.forEach(key => {
            const el = document.createElement('div');
            el.className = 'h2m-key-item';
            el.innerHTML = `
                <div class="key-info">
                    <h4 class="h2m-key-name">${escapeHtml(key.name)}</h4>
                    <div class="h2m-key-meta">
                        <span class="font-mono fs-11">Created: ${new Date(key.createdAt).toLocaleDateString()}</span>
                        <span class="font-mono fs-11">Last used: ${key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</span>
                    </div>
                    <div class="h2m-key-preview font-mono fs-11 text-secondary">${key.prefix || 'hk_'}••••••••</div>
                </div>
                <button class="h2m-revoke-btn" onclick="deleteKey('${key.id}')" title="Revoke Key">Revoke</button>
            `;
            list.appendChild(el);
        });
    } catch (error) {
        console.error('Error loading keys:', error);
        list.innerHTML = '<p class="h2m-empty-msg text-danger">Failed to load keys. Check server status.</p>';
    }
}

window.showKeyModal = () => {
    const modal = document.getElementById('key-modal');
    modal.classList.remove('hidden');
    document.getElementById('generated-key-display').classList.add('hidden');
    document.getElementById('new-key-name').value = '';
    document.getElementById('new-key-name').focus();
    // Allow clicking outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) window.hideKeyModal();
    }, { once: true });
};

window.hideKeyModal = () => {
    document.getElementById('key-modal').classList.add('hidden');
};

window.createKey = async () => {
    const nameInput = document.getElementById('new-key-name');
    const name = nameInput.value.trim();
    if (!name) {
        showToast('⚠️ Key name is required', 'warning');
        nameInput.focus();
        return;
    }

    try {
        const response = await fetch('/api/keys/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, name })
        });
        const result = await response.json();

        if (result.success) {
            document.getElementById('generated-key-display').classList.remove('hidden');
            document.getElementById('raw-key-value').textContent = result.apiKey;
            showToast('✅ API key generated', 'success');
            loadKeys();
        } else {
            showToast(`❌ ${result.error || 'Failed to generate key'}`, 'error');
        }
    } catch (error) {
        console.error('Error creating key:', error);
        showToast('❌ Server error. Please try again.', 'error');
    }
};

window.deleteKey = async (keyId) => {
    if (!confirm('Revoke this API key? Any services using it will stop working.')) return;

    try {
        const response = await fetch(`/api/keys/${keyId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        const result = await response.json();

        if (result.success) {
            showToast('🗑️ API key revoked', 'success');
            loadKeys();
        } else {
            showToast('❌ Failed to revoke key', 'error');
        }
    } catch (error) {
        console.error('Error deleting key:', error);
        showToast('❌ Server error. Please try again.', 'error');
    }
};

window.copyKey = () => {
    const key = document.getElementById('raw-key-value').textContent;
    if (!key) return;
    navigator.clipboard.writeText(key).then(() => {
        showToast('📋 Key copied to clipboard!', 'success');
    }).catch(() => {
        showToast('⚠️ Could not copy. Please copy manually.', 'warning');
    });
};

// ── Utilities ──
function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function showToast(message, type = 'success') {
    const t = document.createElement('div');
    t.className = 'js-toast';
    const colors = {
        success: 'rgba(0,255,100,0.2)',
        warning: 'rgba(255,215,0,0.2)',
        error: 'rgba(255,50,50,0.2)'
    };
    t.style.background = colors[type] || colors.success;
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 10);
    setTimeout(() => {
        t.classList.remove('visible');
        setTimeout(() => t.parentNode && t.parentNode.removeChild(t), 400);
    }, 2600);
}
