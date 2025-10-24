# Airdrop Feature Documentation

## Overview

The Web-Based Wallet now has **two separate features**:

### 1. **Create Wallet with Seed Phrase** (Original Feature)
- Generate or import a BIP39 seed phrase
- Create multiple wallets from a single seed
- View public/private keys
- All data stored locally

### 2. **Airdrop Feature** (New Feature) ⭐
- **Separate page** for requesting test SOL
- Connect any Solana wallet by entering the address
- Request airdrops on devnet or testnet
- Check wallet balance in real-time
- View transactions on Solana Explorer

## How to Use the Airdrop Feature

### Step 1: Navigate to Airdrop Page
From the home screen, you have two options:
- Click **"Create Wallet"** - Opens seed phrase generation (original feature)
- Click **"Airdrop"** - Opens the new airdrop feature

### Step 2: Select Network
Choose between:
- **Devnet** - Solana development network
- **Testnet** - Solana testing network

### Step 3: Connect Your Wallet
1. Enter your **Solana wallet address** (Base58 format)
   - Example: `8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ`
2. Click **"Connect Wallet"**
3. Your wallet will be validated and connected

### Step 4: Request Airdrop
1. Once connected, you'll see your current balance
2. Click **"Request 1 SOL Airdrop"** button
3. Wait for confirmation (usually takes a few seconds)
4. Your balance will automatically refresh
5. Transaction signature will be displayed

### Step 5: View on Explorer
- Click the **Explorer button** to view your wallet on Solana Explorer
- Click the **transaction link** to view the airdrop transaction details

## Features

### Wallet Connection
- ✅ Enter any Solana wallet address
- ✅ Address validation before connecting
- ✅ Disconnect and reconnect anytime
- ✅ No private key required

### Network Support
- ✅ Solana Devnet
- ✅ Solana Testnet
- ✅ Easy network switching
- ❌ Mainnet (intentionally excluded for safety)

### Balance Display
- ✅ Real-time balance checking
- ✅ Manual refresh button
- ✅ Formatted SOL display (4 decimal places)
- ✅ Loading states

### Airdrop Functionality
- ✅ Request 1 SOL per airdrop
- ✅ Transaction confirmation
- ✅ Success/error messages
- ✅ Transaction signature display
- ⚠️ Subject to faucet rate limits

### Explorer Integration
- ✅ View wallet on Solana Explorer
- ✅ View transaction details
- ✅ Network-specific URLs

## UI Design

The airdrop feature maintains the same design language as the original wallet feature:

- ✅ Same color scheme and theme support
- ✅ Consistent card layouts
- ✅ Same button styles and sizes
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light mode support
- ✅ Same typography and spacing
- ✅ Consistent icon usage (lucide-react)

## Technical Details

### Technologies Used
- **@solana/web3.js** - Solana blockchain interactions
- **Next.js** - React framework
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

### Key Functions (`/src/lib/airdrop.ts`)

```typescript
// Request airdrop
requestAirdrop(walletAddress, network, amount)

// Get balance
getBalance(walletAddress, network)

// Validate address
isValidSolanaAddress(address)

// Format display
formatSOL(amount)
formatSolanaAddress(address)

// Explorer URLs
getExplorerUrl(signature, network)
getAddressExplorerUrl(address, network)
```

### Security Features
- ✅ Address validation before connection
- ✅ No private key storage or handling
- ✅ Client-side only operations
- ✅ Error handling for failed requests
- ✅ Rate limit warnings

## Differences from Original Feature

| Feature | Seed Phrase Wallets | Airdrop |
|---------|-------------------|---------|
| **Purpose** | Create new wallets | Request test SOL |
| **Input** | Generate/import seed | Enter existing address |
| **Keys** | Shows private keys | No private key needed |
| **Storage** | Stores in sessionStorage | No storage |
| **Network** | Any (keys work on all) | Devnet/Testnet only |
| **Action** | Wallet management | Airdrop requests |

## Common Use Cases

### For Developers Testing
1. Create wallet using seed phrase feature
2. Copy the generated Solana address
3. Go to Airdrop page
4. Connect with that address
5. Request test SOL for development

### For Existing Wallet Users
1. Go directly to Airdrop page
2. Enter your existing Solana wallet address
3. Select network
4. Request test SOL
5. No need to manage keys in the app

## Limitations & Notes

### Rate Limits
- Solana faucets have rate limits
- Typically 1 airdrop per address per day
- May vary by network congestion

### Network Availability
- Depends on Solana network status
- Testnet/devnet may have occasional downtime
- Check Solana status if requests fail

### Amount
- Fixed at 1 SOL per request
- Future versions may allow custom amounts

## Troubleshooting

### "Invalid Solana address" Error
- Ensure you're using a Base58 address
- Address should be ~44 characters
- Example format: `8FE27ioQh3T7o22QsYVT5Re8NnHFqmFNbdqwiF3ywuZQ`

### "Airdrop failed" Error
- Check network connection
- Verify network is operational
- Wait a few minutes and try again (rate limits)
- Try switching networks

### Balance Not Updating
- Click the refresh button manually
- Check Solana Explorer to verify transaction
- Network delays may occur

## Future Enhancements

Potential features for future versions:
- [ ] Custom airdrop amounts
- [ ] Multiple address batch airdrops
- [ ] Transaction history
- [ ] Token airdrops (SPL tokens)
- [ ] Browser wallet integration (Phantom, Solflare)
- [ ] QR code scanner for addresses

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (both options)
│   ├── seed-phrase/
│   │   └── page.tsx          # Seed phrase feature
│   └── airdrop/
│       └── page.tsx          # NEW: Airdrop feature
├── lib/
│   ├── wallet.ts             # Seed phrase utilities
│   └── airdrop.ts            # NEW: Airdrop utilities
└── components/
    └── WalletCard.tsx        # Unchanged
```

## Navigation Flow

```
Home Page (/)
    ├─→ Create Wallet Button → Seed Phrase Page
    └─→ Airdrop Button → Airdrop Page

Seed Phrase Page → Creates Wallets → Back to Home

Airdrop Page → Connect Wallet → Request Airdrop → Back to Home
```

---

**Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Status**: ✅ Production Ready
