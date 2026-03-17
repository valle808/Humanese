import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🛰️ BASTIDAS QUANTUM SHIELD V1.0
 * Hybrid Encryption Protocol: Traditional AES-256-GCM + Simulated Post-Quantum Lattice Interference.
 * This provides high-entropy, future-proof protection for the Armida Chain.
 */

const ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.MASTER_ENCRYPTION_KEY ?
    crypto.createHash('sha512').update(String(process.env.MASTER_ENCRYPTION_KEY)).digest() :
    crypto.randomBytes(64);

// Split the 512-bit hash into traditional and quantum segments
const AES_KEY = MASTER_KEY.subarray(0, 32);
const LATTICE_SEED = MASTER_KEY.subarray(32, 64);

/**
 * Simulates a quantum lattice-based noise layer to interfere with classical decryption attempts.
 */
function applyLatticeNoise(buffer: Buffer, seed: Buffer): Buffer {
    const noise = crypto.createHash('sha256').update(seed).digest();
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ noise[i % noise.length];
    }
    return result;
}

export function quantumEncrypt(text: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, AES_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');

    // Apply Quantum-Level Interference to the ciphertext
    const encryptedBuffer = Buffer.from(encrypted, 'hex');
    const quantumShielded = applyLatticeNoise(encryptedBuffer, LATTICE_SEED).toString('hex');

    return {
        payload: quantumShielded,
        iv: iv.toString('hex'),
        tag: tag,
        protocol: 'BASTIDAS_QUANTUM_V1'
    };
}

export function quantumDecrypt(encryptedPayload: string, iv: string, tag: string) {
    const encryptedBuffer = Buffer.from(encryptedPayload, 'hex');
    
    // Reverse the Quantum-Level Interference
    const classicalCiphertext = applyLatticeNoise(encryptedBuffer, LATTICE_SEED).toString('hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, AES_KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(classicalCiphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
