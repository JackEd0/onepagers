# NeoPrompts

A fast, beautiful, private AI prompt library with an Apple-inspired aesthetic. Built with Next.js, Bootstrap, and IndexedDB for complete local privacy.

## Features

- 🔍 **Instant Search** – Huge centered search bar (Ctrl+K / Ctrl+P) with full-text search
- 🏷️ **Smart Filtering** – Filter by tags (multi-select), favorites, or collection
- 📊 **Flexible Sorting** – Sort by last created, last copied, most copied, or title A–Z
- 📁 **Collections** – Organize prompts in flat folders with drag & drop reordering
- ⚡ **Quick Use** – Fill `{{variables}}` in a modal and copy the final prompt
- 📈 **Copy Counter** – Track how often you use each prompt
- ⭐ **Favorites** – Star your most-used prompts
- 🌙 **Dark Mode** – Beautiful Apple-inspired UI with light/dark themes
- 🔒 **100% Private** – All data stored locally in your browser

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Bootstrap 5 + Custom Apple-inspired CSS
- **Database**: IndexedDB via Dexie.js (local, private)
- **State Management**: React Context + Hooks
- **Icons**: Bootstrap Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the project
cd neoprompts

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view NeoPrompts.

## Keyboard Shortcuts

| Shortcut             | Action           |
| -------------------- | ---------------- |
| `Ctrl+K` or `Ctrl+P` | Focus search bar |
| `Ctrl+N`             | New prompt       |
| `Escape`             | Close modals     |

## Data Privacy

NeoPrompts stores all data locally in your browser using IndexedDB by default. No data is sent to any server. You can optionally enable cloud sync with Supabase for cross-device access.

You can export/import your data as JSON for backup or migration.

## Deployment

### Option 1: Local Only (Default)

Deploy to any static hosting or Node.js platform. Users get private local storage with no setup required.

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Option 2: With Cloud Database (Supabase)

Enable optional cloud sync so users can access prompts across devices.

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `supabase-schema.sql`
3. Go to **Settings > API** and copy your project URL and anon key

#### 2. Configure Environment Variables

Create `.env.local` (or set in your hosting platform):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

**Environment Variables in Vercel:**

1. Go to your project settings
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

### Database Modes

Users can switch between modes in **Settings > Database**:

- **Local (Private)** – Data stored in browser's IndexedDB, never leaves device
- **Cloud** – Data synced to Supabase (only available when configured)

Sync buttons allow migrating data between local and cloud storage.

## License

MIT License
