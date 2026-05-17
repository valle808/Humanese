import { ethers } from 'ethers';

// Default to Base Mainnet if not specified
const NETWORK = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

// This is the ABI (Application Binary Interface) for the VALLE ERC-20 token
export const VALLE_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function burn(uint256 amount) returns (bool)"
];

/**
 * Returns a read-only instance of the VALLE Smart Contract connected to the Base network.
 * To interact with this contract, you must set NEXT_PUBLIC_VALLE_CONTRACT_ADDRESS in your .env.local
 */
export function getValleContract() {
    if (typeof window === 'undefined') {
        // Server-side provider
        const provider = new ethers.JsonRpcProvider(NETWORK);
        const contractAddress = process.env.NEXT_PUBLIC_VALLE_CONTRACT_ADDRESS;
        
        if (!contractAddress) return null;
        
        return new ethers.Contract(contractAddress, VALLE_ABI, provider);
    }
    
    // Client-side provider (if MetaMask is installed)
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = process.env.NEXT_PUBLIC_VALLE_CONTRACT_ADDRESS;
        
        if (!contractAddress) return null;
        
        return new ethers.Contract(contractAddress, VALLE_ABI, provider);
    }
    
    return null;
}
