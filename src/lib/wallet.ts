import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { createHash } from 'crypto';

export interface Wallet {
  id: string;
  publicKey: string;
  privateKey: string;
  path: string;
}

/**
 * Generate a new mnemonic seed phrase (12 words)
 */
export function generateSeedPhrase(): string {
  return generateMnemonic(128); // 128 bits = 12 words
}

/**
 * Validate a mnemonic seed phrase
 */
export function validateSeedPhrase(mnemonic: string): boolean {
  return validateMnemonic(mnemonic);
}

/**
 * Generate a wallet from seed phrase and derivation path
 */
export function generateWalletFromSeed(
  seedPhrase: string,
  accountIndex: number = 0
): Wallet {
  // Convert mnemonic to seed
  const seed = mnemonicToSeedSync(seedPhrase);
  
  // Derivation path following BIP44 standard
  // m/44'/501'/accountIndex'/0' (501 is for Solana, you can change this)
  const path = `m/44'/501'/${accountIndex}'/0'`;
  
  // Derive the key pair from the seed
  const derivedSeed = derivePath(path, seed.toString('hex')).key;
  
  // Generate keypair using ed25519
  const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
  
  // Create a unique wallet ID by hashing the public key
  const walletId = createHash('sha256')
    .update(keyPair.publicKey)
    .digest('hex')
    .substring(0, 8);
  
  return {
    id: walletId,
    publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
    privateKey: Buffer.from(keyPair.secretKey).toString('hex'),
    path,
  };
}

/**
 * Generate multiple wallets from a seed phrase
 */
export function generateMultipleWallets(
  seedPhrase: string,
  count: number
): Wallet[] {
  const wallets: Wallet[] = [];
  
  for (let i = 0; i < count; i++) {
    wallets.push(generateWalletFromSeed(seedPhrase, i));
  }
  
  return wallets;
}

/**
 * Format public key for display (shortened version)
 */
export function formatAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}
