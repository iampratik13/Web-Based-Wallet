'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  requestAirdrop, 
  getBalance, 
  isValidSolanaAddress, 
  formatSOL,
  getExplorerUrl,
  getAddressExplorerUrl,
  NetworkType 
} from '@/lib/airdrop';
import { Coins, ArrowLeft, Wallet2, RefreshCw, ExternalLink, AlertCircle, Plug2, ChevronDown } from 'lucide-react';
import type { SolanaProvider } from '@/types/phantom';

type WalletType = 'phantom' | 'solflare' | 'backpack' | 'coinbase';

interface WalletInfo {
  name: string;
  installUrl: string;
}

export default function AirdropPage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [network, setNetwork] = useState<NetworkType>('devnet');
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropStatus, setAirdropStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastSignature, setLastSignature] = useState<string>('');
  const [connectionMethod, setConnectionMethod] = useState<'manual' | 'extension' | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  // Wallet configurations
  const walletConfigs: Record<WalletType, WalletInfo> = {
    phantom: {
      name: 'Phantom',
      installUrl: 'https://phantom.app/'
    },
    solflare: {
      name: 'Solflare',
      installUrl: 'https://solflare.com/'
    },
    backpack: {
      name: 'Backpack',
      installUrl: 'https://backpack.app/'
    },
    coinbase: {
      name: 'Coinbase',
      installUrl: 'https://www.coinbase.com/wallet'
    }
  };

  // Check which wallets are installed
  useEffect(() => {
    const checkWallets = () => {
      if (typeof window === 'undefined') return;

      const detected: WalletType[] = [];

      // Check Phantom
      if (window.phantom?.solana?.isPhantom) {
        detected.push('phantom');
      }

      // Check Solflare
      if (window.solflare?.isSolflare) {
        detected.push('solflare');
      }

      // Check Backpack
      if (window.backpack?.isBackpack) {
        detected.push('backpack');
      }

      // Check Coinbase Wallet
      if (window.coinbaseSolana?.isCoinbaseWallet) {
        detected.push('coinbase');
      }

      setAvailableWallets(detected);
    };

    checkWallets();
    
    // Recheck after a delay in case extensions load asynchronously
    const timer = setTimeout(checkWallets, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectWallet = async () => {
    setError('');
    
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!isValidSolanaAddress(walletAddress.trim())) {
      setError('Invalid Solana address. Please enter a valid Base58 address.');
      return;
    }

    setIsConnected(true);
    await fetchBalance();
  };

  const handleConnectExtension = async (walletType: WalletType) => {
    setError('');
    
    try {
      let provider: SolanaProvider | null = null;
      const walletInfo = walletConfigs[walletType];

      // Get the provider based on wallet type
      switch (walletType) {
        case 'phantom':
          provider = window.phantom?.solana ?? null;
          break;
        case 'solflare':
          provider = window.solflare ?? null;
          break;
        case 'backpack':
          provider = window.backpack ?? null;
          break;
        case 'coinbase':
          provider = window.coinbaseSolana ?? null;
          break;
      }
      
      if (!provider) {
        setError(`${walletInfo.name} wallet not found. Redirecting to install page...`);
        window.open(walletInfo.installUrl, '_blank');
        return;
      }

      // Request connection
      const resp = await provider.connect();
      const pubKey = resp.publicKey.toString();
      
      setWalletAddress(pubKey);
      setIsConnected(true);
      setConnectionMethod('extension');
      setConnectedWallet(walletType);
      await getBalanceForAddress(pubKey);
    } catch (err) {
      console.error('Extension connection error:', err);
      setError('Failed to connect wallet extension. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    // If connected via extension, disconnect from extension
    if (connectionMethod === 'extension' && connectedWallet) {
      try {
        let provider: SolanaProvider | null = null;
        
        switch (connectedWallet) {
          case 'phantom':
            provider = window.phantom?.solana ?? null;
            break;
          case 'solflare':
            provider = window.solflare ?? null;
            break;
          case 'backpack':
            provider = window.backpack ?? null;
            break;
          case 'coinbase':
            provider = window.coinbaseSolana ?? null;
            break;
        }
        
        if (provider?.disconnect) {
          await provider.disconnect();
        }
      } catch (err) {
        console.error('Disconnect error:', err);
      }
    }
    
    setWalletAddress('');
    setBalance(null);
    setIsConnected(false);
    setError('');
    setAirdropStatus('');
    setLastSignature('');
    setConnectionMethod(null);
    setConnectedWallet(null);
  };

  const getBalanceForAddress = async (address: string) => {
    setIsLoadingBalance(true);
    try {
      const bal = await getBalance(address, network);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchBalance = async () => {
    if (!walletAddress.trim()) return;
    await getBalanceForAddress(walletAddress.trim());
  };

  const handleAirdrop = async () => {
    if (!isConnected || !walletAddress.trim()) {
      setError('Please connect your wallet first');
      return;
    }

    setIsAirdropping(true);
    setAirdropStatus('Requesting airdrop...');
    setError('');
    
    try {
      const result = await requestAirdrop(walletAddress.trim(), network, selectedAmount);
      
      if (result.success && result.signature) {
        setAirdropStatus(`Airdrop successful! 🎉 ${selectedAmount} SOL received`);
        setLastSignature(result.signature);
        await fetchBalance();
        setTimeout(() => setAirdropStatus(''), 5000);
      } else {
        setError(`Airdrop failed: ${result.error || 'Unknown error'}`);
        setAirdropStatus('');
      }
    } catch {
      setError('Airdrop failed. Please try again.');
      setAirdropStatus('');
    } finally {
      setIsAirdropping(false);
    }
  };

  const handleNetworkChange = async (newNetwork: NetworkType) => {
    setNetwork(newNetwork);
    if (isConnected) {
      await fetchBalance();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              size="sm"
              className="sm:size-default"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <Coins className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">Airdrop</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect your wallet and request test SOL on Solana devnet or testnet
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm sm:text-base flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Wallet Connection */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl">
                    {isConnected ? 'Connected Wallet' : 'Connect Wallet'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {isConnected 
                      ? `Connected via ${connectionMethod === 'extension' ? 'browser extension' : 'manual entry'}` 
                      : 'Choose how to connect your wallet'}
                  </CardDescription>
                </div>
                {/* Network Selection Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Network:</Label>
                  <div className="relative inline-block">
                    <select
                      value={network}
                      onChange={(e) => handleNetworkChange(e.target.value as NetworkType)}
                      disabled={isAirdropping}
                      className="appearance-none bg-background border border-input rounded-lg px-3 py-1.5 pr-8 text-xs font-medium cursor-pointer hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="devnet">devnet</option>
                      <option value="testnet">testnet</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  {/* Connect via Extension */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      Option 1: Browser Extension {availableWallets.length > 0 && `(${availableWallets.length} detected)`}
                    </Label>
                    
                    {availableWallets.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableWallets.map((walletType) => {
                          const wallet = walletConfigs[walletType];
                          return (
                            <Button
                              key={walletType}
                              onClick={() => handleConnectExtension(walletType)}
                              className="w-full h-auto py-4"
                              variant="outline"
                              disabled={isAirdropping}
                            >
                              <div className="flex flex-col items-center gap-1 w-full">
                                <span className="font-semibold text-base">{wallet.name}</span>
                                <span className="text-xs text-muted-foreground">Click to connect</span>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-muted/50 rounded-lg border border-dashed">
                        <Plug2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No Solana wallet extensions detected
                        </p>
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-muted-foreground mb-2">Popular Solana wallets:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {(Object.keys(walletConfigs) as WalletType[]).map((walletType) => {
                              const wallet = walletConfigs[walletType];
                              return (
                                <a
                                  key={walletType}
                                  href={wallet.installUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-foreground hover:underline"
                                >
                                  {wallet.name}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Option 2: Manual Entry</Label>
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address" className="text-xs text-muted-foreground">
                        Wallet Address
                      </Label>
                      <Input
                        id="wallet-address"
                        placeholder="Enter Solana address (Base58)"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="font-mono text-xs sm:text-sm"
                        disabled={isAirdropping}
                      />
                    </div>
                    <Button 
                      onClick={handleConnectWallet} 
                      className="w-full" 
                      size="lg"
                      disabled={isAirdropping}
                      variant="outline"
                    >
                      <Wallet2 className="mr-2 h-4 w-4" />
                      Connect Manually
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 p-3 sm:p-4 bg-muted/50 rounded-lg border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Label className="text-xs text-muted-foreground">Address</Label>
                        {connectionMethod === 'extension' && connectedWallet && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                            <Plug2 className="h-3 w-3" />
                            {walletConfigs[connectedWallet].name}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(getAddressExplorerUrl(walletAddress, network), '_blank')}
                        className="h-7 px-2 text-xs w-full sm:w-auto"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View in Explorer
                      </Button>
                    </div>
                    <div className="p-2 bg-background rounded text-xs font-mono break-all">
                      {walletAddress}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                      <Label className="text-xs text-muted-foreground">Balance</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {isLoadingBalance ? 'Loading...' : balance !== null ? formatSOL(balance) : '---'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={fetchBalance}
                          disabled={isLoadingBalance}
                          className="h-6 w-6 p-0"
                          aria-label="Refresh balance"
                        >
                          <RefreshCw className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDisconnect} 
                    variant="outline" 
                    className="w-full"
                    disabled={isAirdropping}
                  >
                    Disconnect Wallet
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Airdrop Section */}
          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Request Airdrop</CardTitle>
                <CardDescription className="text-sm">
                  Request SOL from the {network} faucet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Selection */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">Amount:</Label>
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(Number(e.target.value))}
                      disabled={isAirdropping}
                      className="w-full sm:w-auto appearance-none bg-background border border-input rounded-lg px-4 py-2 pr-10 text-sm font-medium cursor-pointer hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value={0.5}>0.5 SOL</option>
                      <option value={1}>1 SOL</option>
                      <option value={2}>2 SOL</option>
                      <option value={5}>5 SOL</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <Button
                  onClick={handleAirdrop}
                  disabled={isAirdropping || !isConnected}
                  className="w-full"
                  size="lg"
                >
                  <Coins className="mr-2 h-4 w-4" />
                  {isAirdropping ? 'Requesting Airdrop...' : `Confirm Airdrop`}
                </Button>

                {airdropStatus && (
                  <div className="p-3 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-sm text-center">
                    {airdropStatus}
                  </div>
                )}

                {lastSignature && (
                  <div className="p-3 bg-muted/50 rounded-lg border space-y-2">
                    <Label className="text-xs text-muted-foreground">Last Transaction</Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 p-2 bg-background rounded text-xs font-mono overflow-hidden">
                        <div className="truncate" title={lastSignature}>
                          {lastSignature.substring(0, 8)}...{lastSignature.substring(lastSignature.length - 8)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getExplorerUrl(lastSignature, network), '_blank')}
                        className="w-full sm:w-auto sm:flex-shrink-0"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Transaction
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
                  <p>Rate limits may apply on public faucets</p>
                  <p>Each request sends selected SOL amount to your wallet</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
