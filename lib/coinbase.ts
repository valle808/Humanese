import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';

/**
 * Humanese Central Bank - Coinbase CDP Service
 * 
 * This service handles programmatic interaction with the Coinbase Developer Platform.
 * It allows the Central Bank to create wallets, manage assets, and execute transfers
 * across all supported CDP networks.
 */
export class CoinbaseService {
  private static instance: CoinbaseService;
  private coinbase: Coinbase | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CoinbaseService {
    if (!CoinbaseService.instance) {
      CoinbaseService.instance = new CoinbaseService();
    }
    return CoinbaseService.instance;
  }

  /**
   * Initializes the Coinbase SDK using environment variables.
   * Required Vars:
   * - COINBASE_CDP_API_KEY_NAME: The name of the API key (e.g., 'organizations/...')
   * - COINBASE_CDP_API_KEY_PRIVATE_KEY: The unformatted private key string
   */
  private initialize() {
    const keyName = process.env.COINBASE_CDP_API_KEY_NAME;
    const privateKey = process.env.COINBASE_CDP_API_KEY_PRIVATE_KEY;

    if (keyName && privateKey) {
      try {
        // Configure the SDK
        this.coinbase = new Coinbase({
          apiKeyName: keyName,
          privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        });
        console.log('Coinbase CDP SDK initialized successfully.');
      } catch (error) {
        console.error('Failed to initialize Coinbase CDP SDK:', error);
      }
    } else {
      console.warn('Coinbase CDP credentials missing. Service operating in standby mode.');
    }
  }

  /**
   * Creates a new managed wallet on a specific network.
   * Supported: 'sol', 'btc', 'eth', 'base', 'polygon'
   */
  public async createManagedWallet(networkId: string = 'base') {
    if (!this.coinbase) throw new Error('Coinbase SDK not initialized.');

    try {
      const wallet = await Wallet.create({ networkId });
      console.log(`Created new ${networkId} wallet: ${wallet.getId()}`);
      return wallet;
    } catch (error) {
      console.error(`Error creating ${networkId} wallet:`, error);
      throw error;
    }
  }

  /**
   * Fetches an existing wallet by ID.
   */
  public async getWallet(walletId: string) {
    if (!this.coinbase) throw new Error('Coinbase SDK not initialized.');
    return await Wallet.fetch(walletId);
  }

  /**
   * Consolidates funds from multiple addresses into a single target address.
   * This is a placeholder for high-level logic to be used once wallets are linked.
   */
  public async consolidateFunds(sourceWalletIds: string[], targetWalletId: string) {
    // Logic to iterate through source wallets and sweep balances to target
    console.log(`Initiating consolidation from ${sourceWalletIds.length} sources to ${targetWalletId}`);
    // Implementation would use wallet.createTransfer()
  }
}

export const coinbaseService = CoinbaseService.getInstance();
