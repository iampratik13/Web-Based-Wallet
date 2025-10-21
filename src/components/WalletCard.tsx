'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Check, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Wallet, formatAddress } from '@/lib/wallet';

interface WalletCardProps {
  wallet: Wallet;
  index: number;
  onDelete?: (id: string) => void;
}

export function WalletCard({ wallet, index, onDelete }: WalletCardProps) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);

  const handleCopy = (text: string, type: 'public' | 'private') => {
    navigator.clipboard.writeText(text);
    if (type === 'public') {
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2000);
    } else {
      setCopiedPrivate(true);
      setTimeout(() => setCopiedPrivate(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">Wallet {index + 1}</CardTitle>
            <CardDescription className="text-xs font-mono mt-1 truncate">
              ID: {wallet.id}
            </CardDescription>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(wallet.id)}
              className="text-destructive hover:text-destructive flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Derivation Path</Label>
          <div className="p-2 bg-muted rounded text-xs font-mono break-all">
            {wallet.path}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Public Key</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-muted rounded text-xs font-mono overflow-hidden min-w-0">
              <div className="truncate" title={wallet.publicKey}>
                {formatAddress(wallet.publicKey)}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(wallet.publicKey, 'public')}
              className="flex-shrink-0"
            >
              {copiedPublic ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Private Key</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-muted rounded text-xs font-mono overflow-hidden min-w-0">
              <div className="truncate" title={showPrivateKey ? wallet.privateKey : 'Hidden'}>
                {showPrivateKey ? formatAddress(wallet.privateKey) : '••••••••••••••••••••••••••••••••'}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="flex-shrink-0"
            >
              {showPrivateKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(wallet.privateKey, 'private')}
              disabled={!showPrivateKey}
              className="flex-shrink-0"
            >
              {copiedPrivate ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
