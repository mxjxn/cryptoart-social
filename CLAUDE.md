# CLAUDE.md - AI Assistant Guide for cryptoart-social

This document provides AI assistants with comprehensive information about the codebase structure, development workflows, and key conventions for the **cryptoart-social** repository.

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Development Workflow](#development-workflow)
- [Architecture Patterns](#architecture-patterns)
- [Key Conventions](#key-conventions)
- [Common Tasks](#common-tasks)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Project Overview

**cryptoart-social** is a Farcaster Mini App demonstration application built on top of the frames-v2-demo example repository. It showcases wallet integration, transaction signing, and cryptographic operations within Farcaster mini apps (formerly known as Frames v2).

**Primary Purpose:** Demonstrate multi-frame interfaces with seamless Web3 wallet integration for Farcaster applications.

**Tech Category:** Next.js + TypeScript + React + Farcaster Mini Apps + Web3

---

## Technology Stack

### Core Framework
- **Next.js 16.0.3** (App Router) - React metaframework
- **React 19.2.0** - UI library (stable release)
- **TypeScript 5.9.3** - Type safety

### Web3 & Blockchain
- **@farcaster/miniapp-sdk** (0.2.1) - Farcaster Mini App SDK (formerly Frames v2)
- **wagmi** (3.0.1) - React hooks for Ethereum
- **viem** (2.39.3) - Type-safe Ethereum library
- **Base Chain** - Primary blockchain network

### State Management
- **@tanstack/react-query** (5.90.10) - Server state management and caching

### Styling
- **Tailwind CSS** (3.4.18) - Utility-first CSS
- **PostCSS** (8.4.49) - CSS transformation

### Tools
- **pnpm** - Package manager (preferred)
- **ESLint** (9.39.1) - Code linting

---

## Directory Structure

```
cryptoart-social/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── frames/                   # Frame implementations
│   │   │   ├── hello/               # Hello world frame
│   │   │   │   ├── [name]/         # Dynamic personalized route
│   │   │   │   ├── page.tsx
│   │   │   │   └── opengraph-image.tsx
│   │   │   └── create-auction/      # Auction creation frame
│   │   │       ├── app.tsx
│   │   │       ├── page.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── .well-known/             # Farcaster configuration
│   │   │   └── farcaster.json/route.ts
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── app.tsx                  # Main app component
│   │   ├── providers.tsx            # Context providers
│   │   ├── globals.css              # Global styles
│   │   └── opengraph-image.tsx      # OG image generation
│   ├── components/
│   │   ├── providers/
│   │   │   └── WagmiProvider.tsx   # Wallet & React Query setup
│   │   ├── ui/
│   │   │   └── Button.tsx          # Shared button component
│   │   ├── Demo.tsx                # Frame demo UI
│   │   └── CreateAuction.tsx       # Auction creation UI
│   ├── lib/
│   │   ├── connector.ts            # Custom Wagmi connector
│   │   └── truncateAddress.ts      # Address formatting utility
│   └── types.ts                    # TypeScript interfaces
├── public/
│   ├── icon.png                    # App icon
│   └── splash.png                  # Splash screen
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   └── .eslintrc.json
└── .env.sample                     # Environment variable template
```

### Key Directory Purposes

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `src/app` | Next.js routes and pages | page.tsx, layout.tsx |
| `src/app/frames` | Farcaster frame implementations | hello/, create-auction/ |
| `src/components` | Reusable React components | Demo.tsx, CreateAuction.tsx |
| `src/components/providers` | Context providers | WagmiProvider.tsx |
| `src/components/ui` | Atomic UI components | Button.tsx |
| `src/lib` | Utilities and helpers | connector.ts, truncateAddress.ts |
| `public` | Static assets | icon.png, splash.png |

---

## Development Workflow

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.sample .env

# Configure your environment
# Edit .env with your values
```

### Development Commands

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Environment Variables

Required for local development:

```env
# Application URL (choose one based on environment)
APP_URL="http://localhost:3000"
NEXT_PUBLIC_HOST="http://localhost:3000"

# Optional: Farcaster hub URL for debugging
DEBUG_HUB_HTTP_URL=

# Optional: KV store for slow request example
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Optional: Debugger URL
NEXT_PUBLIC_DEBUGGER_URL=
```

### Testing with Warpcast

To test frames in the Warpcast playground:

1. Use a tunneling tool like [ngrok](https://ngrok.com/)
2. Run `ngrok http 3000`
3. Use the ngrok URL in Warpcast playground
4. Update `APP_URL` or `NEXT_PUBLIC_HOST` to match ngrok URL

---

## Architecture Patterns

### 1. Farcaster Mini App Architecture

Each mini app frame is a separate Next.js route with its own:
- Metadata configuration
- OG image generation
- Frame-specific UI components
- Action handlers

**Example Frame Structure:**
```
src/app/frames/hello/
├── page.tsx              # Frame page component
├── opengraph-image.tsx   # Dynamic OG image
└── [name]/              # Optional: dynamic routes
    ├── page.tsx
    └── opengraph-image.tsx
```

### 2. Custom Wagmi Connector Pattern

The `frameConnector` (src/lib/connector.ts) bridges Farcaster SDK wallet with Wagmi:

```typescript
// Usage in components
import { config } from '~/components/providers/WagmiProvider';
import { useAccount, useSendTransaction } from 'wagmi';

function MyComponent() {
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();
  // ...
}
```

**Key Features:**
- Implements EIP-1193 provider interface
- Handles account/chain changes
- Manages disconnection
- Enables standard Ethereum wallet operations through Frame context

### 3. Provider Hierarchy

```
WagmiProvider (Wallet + React Query)
├── QueryClientProvider
└── Application Components
```

**Implementation:**
- `src/app/providers.tsx` - Root providers wrapper
- `src/components/providers/WagmiProvider.tsx` - Wagmi configuration
- Dynamic imports with `ssr: false` for client-only components

### 4. SSR Optimization

Critical client-only components use dynamic imports:

```typescript
const Demo = dynamic(() => import('~/components/Demo'), { ssr: false });
const WagmiProvider = dynamic(
  () => import('~/components/providers/WagmiProvider'),
  { ssr: false }
);
```

**Purpose:** Reduce payload and prevent hydration issues with wallet providers.

### 5. Dynamic Routing

Uses Next.js dynamic routes for personalization:

```typescript
// src/app/frames/hello/[name]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name?: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  // Dynamic metadata based on route parameter
}
```

### 6. OG Image Generation

Server-side image rendering for social media previews:

```typescript
// src/app/frames/hello/opengraph-image.tsx
export default async function Image() {
  return new ImageResponse(
    <div tw="flex flex-col">
      {/* JSX with Tailwind styles */}
    </div>,
    { width: 600, height: 400 }
  );
}
```

---

## Key Conventions

### TypeScript

**Path Aliases:**
```typescript
// Use either @ or ~ for src imports
import { Demo } from '~/components/Demo';
import { Demo } from '@/components/Demo';
```

**Type Safety:**
- Strict mode enabled
- All components should have proper types
- Use TypeScript interfaces for props
- Import types from appropriate packages

**Configuration:**
- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: preserve (for Next.js)

### React Components

**File Naming:**
- Components: PascalCase (e.g., `Demo.tsx`, `CreateAuction.tsx`)
- Utilities: camelCase (e.g., `connector.ts`, `truncateAddress.ts`)
- Pages: lowercase (e.g., `page.tsx`, `layout.tsx`)

**Component Structure:**
```typescript
'use client'; // Add if component uses hooks/client features

import { useState } from 'react';

export default function ComponentName() {
  // Hooks first
  const [state, setState] = useState();

  // Event handlers
  const handleEvent = () => {};

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Styling

**Tailwind CSS:**
- Use utility classes directly in JSX
- Custom colors/config in `tailwind.config.ts`
- Global styles in `src/app/globals.css`

**Examples:**
```tsx
<div className="flex flex-col gap-4 p-4">
  <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Click me
  </button>
</div>
```

### Web3 Integration

**Wagmi Hooks:**
```typescript
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';

function Component() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
}
```

**Viem for Type-Safe Ethereum:**
```typescript
import { parseEther, formatEther } from 'viem';

const value = parseEther('0.1'); // Convert to wei
const readable = formatEther(value); // Convert back
```

### Farcaster Mini App SDK Integration

**Context Access:**
```typescript
import sdk from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';

function MiniAppComponent() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      sdk.actions.ready();
      setIsSDKLoaded(true);
    };
    load();
  }, []);
}
```

### Metadata Configuration

**Frame Metadata Pattern:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Frame Title',
    openGraph: {
      title: 'Frame Title',
      images: ['/opengraph-image'],
    },
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: `${NEXT_PUBLIC_URL}/frames/hello/opengraph-image`,
        button: {
          title: 'Button Text',
          action: {
            type: 'launch_frame',
            name: 'Frame Name',
            url: `${NEXT_PUBLIC_URL}/frames/hello`,
            splashImageUrl: `${NEXT_PUBLIC_URL}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
    },
  };
}
```

---

## Common Tasks

### Adding a New Frame

1. **Create frame directory:**
```bash
mkdir -p src/app/frames/my-frame
```

2. **Create page.tsx:**
```typescript
// src/app/frames/my-frame/page.tsx
import type { Metadata } from 'next';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My Frame',
    openGraph: { title: 'My Frame', images: ['/opengraph-image'] },
    other: {
      'fc:frame': JSON.stringify({
        version: 'next',
        imageUrl: `${NEXT_PUBLIC_URL}/frames/my-frame/opengraph-image`,
        button: {
          title: 'Launch My Frame',
          action: {
            type: 'launch_frame',
            name: 'My Frame',
            url: `${NEXT_PUBLIC_URL}/frames/my-frame`,
            splashImageUrl: `${NEXT_PUBLIC_URL}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
    },
  };
}

export default async function MyFrame() {
  const App = (await import('./app')).default;
  return <App />;
}

export const revalidate = 300;
```

3. **Create app.tsx:**
```typescript
// src/app/frames/my-frame/app.tsx
'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

export default function MyFrameApp() {
  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    load();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <h1>My Frame Content</h1>
    </div>
  );
}
```

4. **Create opengraph-image.tsx:**
```typescript
// src/app/frames/my-frame/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export default async function Image() {
  return new ImageResponse(
    <div tw="flex flex-col w-full h-full items-center justify-center bg-black text-white">
      <h1 tw="text-6xl">My Frame</h1>
    </div>,
    { width: 600, height: 400 }
  );
}
```

### Adding a New Component

1. **Determine component type:**
   - Shared UI: `src/components/ui/`
   - Feature-specific: `src/components/`
   - Provider: `src/components/providers/`

2. **Create component file:**
```typescript
// src/components/MyComponent.tsx
'use client';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white">
      {title}
    </button>
  );
}
```

3. **Import and use:**
```typescript
import MyComponent from '~/components/MyComponent';
```

### Adding a Utility Function

```typescript
// src/lib/myUtil.ts
export function myUtilFunction(input: string): string {
  return input.toUpperCase();
}
```

### Working with Wagmi Hooks

```typescript
'use client';

import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { config } from '~/components/providers/WagmiProvider';

export default function SendEth() {
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleSend = () => {
    sendTransaction({
      to: '0x...',
      value: parseEther('0.01'),
    });
  };

  return address ? (
    <button onClick={handleSend}>Send ETH</button>
  ) : (
    <p>Connect wallet</p>
  );
}
```

---

## Testing

**Current Status:** No testing framework is configured.

**Recommendations for Future Testing:**

### Suggested Stack
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Setup Example (Not Implemented)
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

### Test File Naming
- Unit tests: `*.test.ts`, `*.test.tsx`
- Component tests: `ComponentName.test.tsx`
- Integration tests: `*.integration.test.ts`

---

## Deployment

### Environment-Specific URLs

The application automatically detects the deployment environment:

```typescript
const NEXT_PUBLIC_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
```

### Vercel Deployment

**Automatic:**
- Push to main branch triggers deployment
- `VERCEL_URL` automatically provided
- Environment variables managed in Vercel dashboard

**Manual:**
```bash
pnpm build
pnpm start
```

### StackBlitz Deployment

Special configuration in `.stackblitzrc`:
```json
{
  "installDependencies": false,
  "startCommand": "node ./scripts/run-stackblitz.js"
}
```

### Docker/Other Platforms

```dockerfile
# Example Dockerfile (not included in repo)
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

### Required Environment Variables

**Production:**
- `NEXT_PUBLIC_URL` or `NEXT_PUBLIC_HOST` - Application base URL

**Optional:**
- `DEBUG_HUB_HTTP_URL` - Farcaster hub for debugging
- `KV_REST_API_URL` - Key-value store URL
- `KV_REST_API_TOKEN` - Key-value store token
- `NEXT_PUBLIC_DEBUGGER_URL` - Debugger URL

### Build Configuration

**next.config.ts:**
```typescript
const nextConfig = {
  experimental: {
    staticPageGenerationTimeout: 180, // 3 minutes
  },
};
```

---

## Key Files Reference

### Entry Points
- **src/app/page.tsx** - Home page (main entry)
- **src/app/layout.tsx** - Root layout wrapper
- **src/app/app.tsx** - Main app component

### Configuration
- **next.config.ts** - Next.js configuration
- **tsconfig.json** - TypeScript configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **package.json** - Dependencies and scripts

### Core Components
- **src/components/Demo.tsx** - Frame demo UI
- **src/components/CreateAuction.tsx** - Auction creation UI
- **src/components/providers/WagmiProvider.tsx** - Wallet setup
- **src/components/ui/Button.tsx** - Shared button component

### Utilities
- **src/lib/connector.ts** - Custom Wagmi connector for Frames
- **src/lib/truncateAddress.ts** - Address formatting

### API Routes
- **src/app/.well-known/farcaster.json/route.ts** - Farcaster configuration endpoint

---

## Important Notes for AI Assistants

### When Working on This Codebase:

1. **Prefer editing existing files** over creating new ones
2. **Use TypeScript strictly** - no `any` types
3. **Follow the established patterns** (SSR optimization, dynamic imports)
4. **Use path aliases** (`~/` or `@/`) for imports
5. **Maintain Tailwind CSS** for styling (no CSS modules)
6. **Use Wagmi hooks** for all Web3 operations
7. **Test in Warpcast** using ngrok for frame functionality
8. **Follow Next.js App Router** conventions
9. **Use pnpm** as the package manager
10. **Keep components client-side** when using hooks/SDK

### Security Considerations:

- Never commit `.env` files
- Validate all user inputs
- Use viem for type-safe blockchain interactions
- Follow Web3 best practices for transaction handling
- Be cautious with wallet permissions

### Performance:

- Use dynamic imports for heavy client-side components
- Optimize images with Next.js Image component
- Set appropriate revalidation times for static pages
- Minimize client-side JavaScript bundle

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Farcaster Mini Apps Docs](https://docs.farcaster.xyz/developers/frames/v2) (formerly Frames v2)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated:** 2025-11-20
**Version:** 2.1.0
**Maintained by:** AI Assistant (Claude)

## Changelog

### v2.1.0 (2025-11-20)
- **Migrated to Farcaster Mini App SDK**
  - Replaced `@farcaster/frame-sdk` and `@farcaster/frame-core` with `@farcaster/miniapp-sdk` (0.2.1)
  - Updated all imports to use `@farcaster/miniapp-sdk`
  - Updated terminology throughout documentation (Frames v2 → Mini Apps)
  - This aligns with Farcaster's official SDK naming convention
- Build verified ✅

### v2.0.0 (2025-11-20)
- Updated all dependencies to latest versions
- **Breaking Changes:**
  - Upgraded React from 19.0.0-rc to stable 19.2.0
  - Upgraded Next.js from 15.0.3 to 16.0.3
  - Upgraded wagmi from 2.14.7 to 3.0.1 (major version with API changes)
  - Upgraded Farcaster SDK packages (frame-sdk 0.0.26 → 0.1.12, frame-core 0.0.24 → 0.3.11)
  - Upgraded ESLint from 8.x to 9.39.1
  - Kept Tailwind CSS at 3.4.18 (v4 requires migration to @tailwindcss/postcss)
- Fixed type compatibility issues with new Farcaster SDK API
- Updated custom Wagmi connector for v3 API compatibility
- Updated TypeScript to 5.9.3
