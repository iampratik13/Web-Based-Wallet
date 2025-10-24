import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

export type NetworkType = 'devnet' | 'testnet';

export interface AirdropResult {
  success: boolean;
  signature?: string;
  error?: string;
  amount?: number;
}

/**
 * Get connection to Solana cluster
 */
export function getConnection(network: NetworkType): Connection {
  const endpoint = network === 'devnet' 
    ? clusterApiUrl('devnet')
    : clusterApiUrl('testnet');
  
  return new Connection(endpoint, 'confirmed');
}

/**
 * Request airdrop from faucet with retry logic
 */
export async function requestAirdrop(
  walletAddress: string,
  network: NetworkType,
  amount: number = 1,
  maxRetries: number = 3
): Promise<AirdropResult> {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const connection = getConnection(network);
      const publicKey = new PublicKey(walletAddress);
      
      // Request airdrop
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      
      // Confirm transaction with timeout
      await Promise.race([
        connection.confirmTransaction(signature, 'confirmed'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
        )
      ]);
      
      return {
        success: true,
        signature,
        amount,
      };
    } catch (error) {
      console.error(`Airdrop attempt ${attempt}/${maxRetries} failed:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      lastError = errorMessage;
      
      // Check for specific error types
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        lastError = 'Rate limit exceeded. Please wait a few minutes and try again.';
        break; // Don't retry rate limit errors
      } else if (errorMessage.includes('Internal error')) {
        lastError = 'Faucet is temporarily unavailable. Please try again in a few minutes or use a smaller amount.';
        // Wait before retry for internal errors
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
      } else if (errorMessage.includes('insufficient funds')) {
        lastError = 'Faucet has insufficient funds. Try requesting a smaller amount.';
        break;
      }
      
      // If this is the last attempt, break
      if (attempt === maxRetries) break;
    }
  }
  
  return {
    success: false,
    error: lastError || 'Failed to request airdrop after multiple attempts',
  };
}

/**
 * Get wallet balance
 */
export async function getBalance(
  walletAddress: string,
  network: NetworkType
): Promise<number> {
  try {
    const connection = getConnection(network);
    const publicKey = new PublicKey(walletAddress);
    
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Balance fetch error:', error);
    return 0;
  }
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format SOL amount for display
 */
export function formatSOL(amount: number): string {
  return amount.toFixed(4) + ' SOL';
}

/**
 * Format Solana address for display
 */
export function formatSolanaAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(signature: string, network: NetworkType): string {
  const cluster = network === 'devnet' ? 'devnet' : 'testnet';
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
}

/**
 * Get explorer URL for address
 */
export function getAddressExplorerUrl(address: string, network: NetworkType): string {
  const cluster = network === 'devnet' ? 'devnet' : 'testnet';
  return `https://explorer.solana.com/address/${address}?cluster=${cluster}`;
}
