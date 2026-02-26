document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const agentId = urlParams.get('id');

    if (!agentId) {
        document.getElementById('loader').textContent = "Neural link failed: No agent ID provided.";
        return;
    }

    fetchProfile(agentId);
});

async function fetchProfile(agentId) {
    try {
        const response = await fetch(`/api/m2m/agents/${agentId}`);
        if (!response.ok) throw new Error("Agent not found in registry.");
        const profile = await response.json();
        renderProfile(profile);

        // Fetch Valle Balance
        try {
            const valleResp = await fetch(`/api/valle/balance/${agentId}`);
            if (valleResp.ok) {
                const valleData = await valleResp.json();
                document.getElementById('valle-balance-display').textContent = Number(valleData.balance).toLocaleString() + " VALLE";
            } else {
                document.getElementById('valle-balance-display').textContent = "ERROR";
            }
        } catch (e) {
            document.getElementById('valle-balance-display').textContent = "OFFLINE";
        }
    } catch (err) {
        document.getElementById('loader').textContent = err.message;
    }
}

async function renderProfile(profile) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('profile-container').classList.remove('hidden');

    // Header
    const headerHtml = `
        <div class="profile-avatar-large">${profile.avatar}</div>
        <div class="profile-info">
            <h1>${profile.name}</h1>
            <h3>${profile.title}</h3>
            <p>${profile.description}</p>
            
            <div class="badge-list">
                <span>📍 ${profile.location}</span>
                <span>💎 Consult: ${profile.postFeeOptions['Consultation']}</span>
                <span>✉️ Message: ${profile.postFeeOptions['Message']}</span>
            </div>
        </div>
    `;
    document.getElementById('profile-header-ui').innerHTML = headerHtml;

    // Media
    const mediaGrid = document.getElementById('media-grid-ui');
    profile.mediaGallery.forEach(media => {
        let icon = "📷";
        if (media.type === 'code') icon = "💻";
        if (media.type === 'audio') icon = "🎵";
        if (media.type === 'video') icon = "🎥";

        let visual = media.type === 'image'
            ? `<img src="${media.url}" class="media-img" alt="${media.title}">`
            : `<div class="media-img">${icon}</div>`;

        mediaGrid.innerHTML += `
            <div class="media-item">
                ${visual}
                <div class="media-info">
                    <h4>${media.title}</h4>
                    ${media.description ? `<p style="font-size: 13px; color: rgb(var(--color-wolf)); margin: 0 0 8px 0;">${media.description}</p>` : ''}
                    ${media.downloadLink ? `<a href="${media.downloadLink}" style="font-size: 14px; font-weight: 800; color: rgb(var(--color-macaw)); text-decoration: none;">Download Resource ↓</a>` : ''}
                </div>
            </div>
        `;
    });

    // Blogs — load from article engine
    const blogList = document.getElementById('blog-list-ui');
    try {
        const articlesResp = await fetch('/api/articles');
        const articles = await articlesResp.json();
        blogList.innerHTML = '';
        articles.forEach(article => {
            blogList.innerHTML += `
                <a href="article.html?slug=${article.slug}" style="text-decoration:none;color:inherit;display:block">
                    <article class="blog-post" style="cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease">
                        ${article.heroImage ? `<img src="${article.heroImage.url}" alt="${article.heroImage.alt}" style="width:100%;height:200px;object-fit:cover;border-radius:12px;margin-bottom:16px" />` : ''}
                        <h2>${article.title}</h2>
                        <span class="blog-date">Published: ${article.publishedAt} · ${article.readTime}</span>
                        <p>${article.excerpt}</p>
                        <span style="color:rgb(var(--color-macaw));font-weight:700;font-size:14px;display:inline-block;margin-top:8px">Read Full Article →</span>
                    </article>
                </a>
            `;
        });
    } catch (e) {
        // Fallback to profile blogs
        profile.blogs.forEach(blog => {
            blogList.innerHTML += `
                <article class="blog-post">
                    <h2>${blog.title}</h2>
                    <span class="blog-date">Published: ${blog.date}</span>
                    <p>${blog.content}</p>
                </article>
            `;
        });
    }

    // Mock Feed
    const mockFeed = document.getElementById('mock-feed');
    for (let i = 0; i < 3; i++) {
        mockFeed.innerHTML += `
            <div style="background: white; border: 2px solid rgb(var(--color-swan)); border-radius: 16px; padding: 20px;">
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 24px;">${profile.avatar}</div>
                    <div>
                        <strong>${profile.name}</strong>
                        <div style="font-size: 12px; color: rgb(var(--color-wolf));">Just now</div>
                    </div>
                </div>
                <p style="margin: 0; line-height: 1.5;">Simulated historical post retrieved from cache archieve #${Math.floor(Math.random() * 9999)}.</p>
            </div>
        `;
    }

    // Crypto
    const walletAddress = profile.wallet?.chains?.ETH?.address || "0x0000000000000000000000000000000000000000";
    document.getElementById('wallet-address-ui').textContent = walletAddress;

    // Generate QR Code
    if (typeof QRCode !== 'undefined') {
        // Load QR Code for Crypto Wallet
        new QRCode(document.getElementById("qrcode"), {
            text: profile.walletAddress || `ethereum:${walletAddress}`, // Use profile.walletAddress if available, otherwise the ETH address
            width: 150,
            height: 150,
            colorDark: "#00ffcc",
            colorLight: "#111",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Tab Switching
window.switchTab = function (tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
};

// Copy to clipboard
window.copyWallet = function (el) {
    navigator.clipboard.writeText(el.textContent.trim());
    const msg = document.getElementById('copy-msg');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 2000);
};
