/**
 * js/web3-auth.js
 * Humanese Web3 Authentication Bridge
 * Handles Metamask/Wallet connection and signature verification.
 */

async function connectWallet() {
    const btn = document.getElementById('connect-wallet-button');
    const span = document.getElementById('wallet-button-span');

    if (!window.ethereum) {
        alert("Please install Metamask or a compatible Web3 wallet.");
        return;
    }

    try {
        span.textContent = "CONNECTING...";

        // 1. Request accounts
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // 2. Request a challenge/nonce from the server (Mocked for now or use static for simplicity)
        const challenge = `Humanese Sovereign Matrix Authentication\nAddress: ${address}\nTimestamp: ${Date.now()}`;

        // 3. Sign the message
        const signature = await signer.signMessage(challenge);

        // 4. Verify with backend
        const res = await fetch('/api/auth/web3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, signature, challenge })
        });

        const data = await res.json();

        if (data.success) {
            console.log("Web3 Auth Successful:", data.user);
            sessionStorage.setItem("user-info", JSON.stringify(data.user));

            // Show success
            document.getElementById('success-message').textContent = "Wallet Linked Successfully!";
            document.getElementById('success-message').style.display = 'block';

            setTimeout(() => {
                window.location.href = "./learn.html";
            }, 1500);
        } else {
            throw new Error(data.error || "Web3 Verification Failed");
        }

    } catch (err) {
        console.error("Web3 Error:", err);
        alert("Connection Failed: " + err.message);
        span.textContent = "CONNECT CRYPTO WALLET";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const walletBtn = document.getElementById('connect-wallet-button');
    if (walletBtn) {
        walletBtn.addEventListener('click', connectWallet);
    }
});
