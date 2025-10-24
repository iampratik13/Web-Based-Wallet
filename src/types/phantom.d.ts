// Solana Wallet Types
export interface SolanaPublicKey {
  toString: () => string;
  toBuffer: () => Buffer;
  toBytes?: () => Uint8Array;
}

export interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  isCoinbaseWallet?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: SolanaPublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: unknown) => void) => void;
  request?: (args: { method: string; params?: unknown }) => Promise<unknown>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
  signAllTransactions?: (transactions: unknown[]) => Promise<unknown[]>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: SolanaProvider;
    };
    solana?: SolanaProvider;
    solflare?: SolanaProvider;
    backpack?: SolanaProvider;
    coinbaseSolana?: SolanaProvider;
  }
}

export {};
