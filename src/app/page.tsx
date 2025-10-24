'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WalletCard } from '@/components/WalletCard';
import { ThemeToggle } from '@/components/theme-toggle';
import { generateWalletFromSeed, Wallet } from '@/lib/wallet';
import { Wallet2, Plus, Key, Coins } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSeed = sessionStorage.getItem('seedPhrase');
    if (storedSeed) {
      setSeedPhrase(storedSeed);
    }
    setLoading(false);
  }, []);

  const handleAddWallet = () => {
    if (!seedPhrase) {
      router.push('/seed-phrase');
      return;
    }
    const newWallet = generateWalletFromSeed(seedPhrase, wallets.length);
    setWallets([...wallets, newWallet]);
  };

  const handleDeleteWallet = (id: string) => {
    setWallets(wallets.filter(wallet => wallet.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all wallets? This cannot be undone.')) {
      setWallets([]);
    }
  };

  const handleChangeSeed = () => {
    if (confirm('Changing seed phrase will clear all current wallets. Continue?')) {
      sessionStorage.removeItem('seedPhrase');
      setWallets([]);
      router.push('/seed-phrase');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!seedPhrase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
            <ThemeToggle />
          </div>
          
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="flex justify-center">
              <div className="p-4 sm:p-6 rounded-full bg-primary/10">
                <Wallet2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Web-Based Wallet
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto px-4">
                Secure crypto wallet management with seed phrase technology
              </p>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <Button 
                onClick={() => router.push('/seed-phrase')} 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
              >
                <Key className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create Wallet
              </Button>
              <Button 
                onClick={() => router.push('/airdrop')} 
                size="lg" 
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
              >
                <Coins className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Airdrop
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground pt-4 sm:pt-8">
              Your keys, your crypto. Fully decentralized.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <Wallet2 className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">My Wallets</h1>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your crypto wallets generated from your seed phrase
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          <Button onClick={handleAddWallet} className="flex items-center space-x-2 flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            <span>Add Wallet</span>
          </Button>
          
          <Button onClick={() => router.push('/airdrop')} variant="outline" className="flex-1 sm:flex-none">
            <Coins className="mr-2 h-4 w-4" />
            <span>Airdrop</span>
          </Button>
          
          <Button onClick={handleChangeSeed} variant="outline" className="flex-1 sm:flex-none">
            <Key className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Change Seed Phrase</span>
            <span className="sm:hidden">Change Seed</span>
          </Button>

          {wallets.length > 0 && (
            <Button onClick={handleClearAll} variant="destructive" className="flex-1 sm:flex-none">
              <span className="hidden sm:inline">Clear All Wallets</span>
              <span className="sm:hidden">Clear All</span>
            </Button>
          )}
        </div>

        {wallets.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Your Wallets ({wallets.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {wallets.map((wallet, index) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  index={index}
                  onDelete={handleDeleteWallet}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
              <Wallet2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No wallets yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center mb-4 max-w-md">
                Click &quot;Add Wallet&quot; to create your first wallet from your seed phrase
              </p>
              <Button onClick={handleAddWallet} size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create First Wallet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
