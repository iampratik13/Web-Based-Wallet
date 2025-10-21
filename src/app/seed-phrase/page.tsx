'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { SeedPhraseDisplay } from '@/components/SeedPhraseDisplay';
import { generateSeedPhrase, validateSeedPhrase } from '@/lib/wallet';
import { RefreshCw, ArrowRight, ArrowLeft, Wallet2 } from 'lucide-react';

export default function SeedPhrasePage() {
  const router = useRouter();
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [inputSeedPhrase, setInputSeedPhrase] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateNewSeed = () => {
    const newSeed = generateSeedPhrase();
    setSeedPhrase(newSeed);
    setInputSeedPhrase('');
    setError('');
  };

  const handleImportSeed = () => {
    const trimmedSeed = inputSeedPhrase.trim();
    if (!validateSeedPhrase(trimmedSeed)) {
      setError('Invalid seed phrase. Please enter a valid 12-word mnemonic.');
      return;
    }
    setSeedPhrase(trimmedSeed);
    setError('');
  };

  const handleContinueToWallets = () => {
    if (!seedPhrase) {
      setError('Please generate or import a seed phrase first.');
      return;
    }
    sessionStorage.setItem('seedPhrase', seedPhrase);
    router.push('/');
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
            <Wallet2 className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">Seed Phrase</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate a new seed phrase or import an existing one
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm sm:text-base">
            {error}
          </div>
        )}

        {seedPhrase && (
          <div className="mb-6">
            <SeedPhraseDisplay seedPhrase={seedPhrase} />
            <div className="flex justify-end mt-4">
              <Button onClick={handleContinueToWallets} size="lg" className="w-full sm:w-auto">
                Continue to Wallets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {!seedPhrase && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="space-y-1 sm:space-y-1.5">
                <CardTitle className="text-lg sm:text-xl">Generate New Seed</CardTitle>
                <CardDescription className="text-sm">
                  Create a new 12-word seed phrase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGenerateNewSeed} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Seed Phrase
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1 sm:space-y-1.5">
                <CardTitle className="text-lg sm:text-xl">Import Existing Seed</CardTitle>
                <CardDescription className="text-sm">
                  Enter your 12-word seed phrase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seed-input" className="text-sm sm:text-base">Seed Phrase</Label>
                  <Input
                    id="seed-input"
                    placeholder="word1 word2 word3 ..."
                    value={inputSeedPhrase}
                    onChange={(e) => setInputSeedPhrase(e.target.value)}
                    className="font-mono text-xs sm:text-sm"
                  />
                </div>
                <Button onClick={handleImportSeed} className="w-full" variant="secondary" size="lg">
                  Import Seed Phrase
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
