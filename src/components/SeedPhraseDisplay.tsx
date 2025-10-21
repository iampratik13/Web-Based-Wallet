'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

interface SeedPhraseDisplayProps {
  seedPhrase: string;
}

export function SeedPhraseDisplay({ seedPhrase }: SeedPhraseDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const words = seedPhrase.split(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Your Seed Phrase</CardTitle>
        <CardDescription>
          Store this seed phrase securely. It&apos;s the only way to recover your wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-muted rounded-lg">
            {words.map((word, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground w-6 flex-shrink-0">{index + 1}.</span>
                <span className="font-mono text-sm break-all">
                  {isVisible ? word : '••••••'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="flex items-center space-x-2"
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{isVisible ? 'Hide' : 'Show'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center space-x-2"
              disabled={!isVisible}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
