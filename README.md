# Web-Based Wallet

A secure, decentralized cryptocurrency wallet built with Next.js, featuring seed phrase generation and multiple wallet management.

## Features

- 🔐 **Secure Seed Phrase Generation** - Generate BIP39-compliant 12-word seed phrases
- 💼 **Multiple Wallets** - Create unlimited wallets from a single seed phrase
- 🔑 **Unique Key Pairs** - Each wallet has unique ED25519 public/private key pairs
- 🌓 **Dark/Light Mode** - Beautiful theme toggle with system preference support
- 📱 **Mobile Responsive** - Fully optimized for all device sizes
- 🔒 **Privacy First** - All data stored locally in sessionStorage

## Tech Stack

- **Framework**: Next.js 15.5.6 with React 19
- **UI**: shadcn/ui + Tailwind CSS v4
- **Cryptography**: BIP39, BIP44 derivation, ED25519 (tweetnacl)
- **Theme**: next-themes
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd web-based-wallet

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js and deploy

### Option 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main wallet management page
│   │   ├── seed-phrase/
│   │   │   └── page.tsx          # Seed phrase generation/import
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── globals.css           # Global styles
│   │   └── icon.svg              # Custom favicon
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── SeedPhraseDisplay.tsx # Seed phrase component
│   │   ├── WalletCard.tsx        # Wallet display component
│   │   ├── theme-provider.tsx    # Theme context provider
│   │   └── theme-toggle.tsx      # Theme switcher component
│   └── lib/
│       ├── utils.ts              # Utility functions
│       └── wallet.ts             # Core wallet cryptography
├── public/                       # Static assets
├── package.json                  # Dependencies
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── vercel.json                   # Vercel deployment config
```

## Security Notes

⚠️ **Important Security Considerations:**

- This is a demo wallet for educational purposes
- Never use for production with real funds without proper security audit
- Seed phrases are stored in sessionStorage (cleared on browser close)
- Private keys are hidden by default with bullet masking
- No server-side storage - all cryptography happens client-side

## Features in Detail

### Seed Phrase Management
- Generate secure 12-word BIP39 mnemonics
- Import existing seed phrases
- Validate seed phrase format
- Hide/show seed words with bullet masking

### Wallet Generation
- BIP44 derivation path: `m/44'/501'/accountIndex'/0'`
- ED25519 key pair generation
- Unique wallet IDs using SHA-256
- Public/private key display with copy functionality

### User Interface
- Clean, modern design with shadcn/ui
- Responsive layouts for mobile, tablet, desktop
- Dark/light theme with custom toggle animation
- Accessibility-focused components

## Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Next.js and shadcn/ui

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
