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

NeoPrompts stores all data locally in your browser using IndexedDB. No data is sent to any server. You can export/import your data as JSON for backup or migration.

## License

MIT License
