# SupaPrompts

Personal AI Prompt Manager powered by your own Supabase instance.

A fast, beautiful, private prompt library in the browser that feels like Apple's Bookmarks / Notes app.

## Features

- **Instant Search** – Huge centered search bar (Ctrl+K / Ctrl+P) with full-text search across titles, templates, tags, and descriptions
- **Smart Filtering** – Filter by tags (multi-select), favorites, or collection
- **Flexible Sorting** – Sort by last created, last copied, most copied, or title A–Z
- **Collections** – Organize prompts in flat folders with drag & drop reordering
- **Quick Use** – Fill `{{variables}}` in a modal and copy the final prompt
- **Copy Counter** – Track how often you use each prompt
- **Favorites** – Star your most-used prompts
- **Sharing** – Generate public read-only links with "Add to my SupaPrompts" button
- **Dark Mode** – Beautiful Apple-inspired UI with light/dark themes
- **PWA Ready** – Install as a standalone app

## Tech Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **UI:** Bootstrap 5 + Bootstrap Icons
- **State:** Pinia
- **Routing:** Vue Router
- **Data:** Supabase-js (direct client)
- **Build:** Vite
- **Deployment:** Vercel / Netlify / Cloudflare Pages

## Installation

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works fine)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JackEd0/supaprompts.git
   cd supaprompts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema (see `Requirements.md` for the full schema)
3. Copy your Supabase URL and anon key
4. Enter them in the app's Settings page

## Usage

1. **Configure Supabase** – Go to Settings and enter your Supabase URL + anon key
2. **Create Collections** – Organize your prompts into collections (folders)
3. **Add Prompts** – Create prompts with templates, tags, and descriptions
4. **Use Variables** – Add `{{variable_name}}` placeholders for dynamic content
5. **Quick Copy** – Click copy or use Quick Use modal for prompts with variables
6. **Share** – Generate public links to share prompts with others

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
