# SupaPrompts – Requirements

## Project Goal

Ship a fast, beautiful, private prompt library in the browser that feels like Apple's Bookmarks / Notes app.

---

## Core Features

### Search & Discovery
- Huge centered search bar with keyboard shortcut (Ctrl+K or Ctrl+P)
- Instant full-text search across title, template, tags, and description
- Filter by: Tags (multi-select) | Favorites only | Collection
- Sort by: Last created | Last copied | Most copied | Title A–Z

### Collections
- Flat list displayed in sidebar
- Drag & drop to reorder
- CRUD operations (create, read, update, delete)

### Prompts
- Card view displaying:
  - Title
  - Preview of template
  - Tags
  - Favorite star
  - Copy button (with counter)
- CRUD operations
- Support for `{{variable}}` placeholders

### Quick Use
- If prompt has `{{variables}}`, open modal
- Fill in variable fields
- Copy final rendered prompt

### Sharing
- Generate public read-only link for any prompt
- "Add to my SupaPrompts" button on shared prompts
- Import prompts from shared links

### Settings
- Input Supabase URL + anon key
- Saved in localStorage
- No authentication required (user's own Supabase instance)

### UI/UX
- Responsive design (mobile-first)
- PWA-ready (installable)
- Dark mode support
- Apple-inspired aesthetic:
  - Blurred backgrounds
  - Large typography
  - Generous whitespace
  - Rounded corners

---

## Technical Requirements

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vue | ^3.4 | Frontend framework |
| vue-router | ^4.2 | Client-side routing |
| pinia | ^2.1 | State management |
| @supabase/supabase-js | ^2.x | Supabase client |
| bootstrap | ^5.3 | UI framework |
| bootstrap-icons | ^1.11 | Icon library |
| vite | ^5.x | Build tool |
| vite-plugin-pwa | ^0.17 | PWA support |

### Tech Stack

- **Framework:** Vue 3 (Composition API + `<script setup>`)
- **UI:** Bootstrap 5 + Bootstrap Icons
- **Styling:** Custom CSS (Apple-like modern aesthetic)
- **Routing:** Vue Router
- **State:** Pinia for local state
- **Data:** Supabase-js (direct client)
- **Build:** Vite
- **Deployment:** Vercel / Netlify / Cloudflare Pages

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Supabase Schema

```sql
-- Collections (replaces folders)
create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Prompts
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid references collections(id) on delete set null,
  title text not null,
  template text not null,
  description text,
  example_input jsonb,
  example_output text,
  tags text[] default '{}',
  is_favorite boolean default false,
  copied_count int default 0,
  last_copied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (optional for MVP)
-- alter table collections enable row level security;
-- alter table prompts enable row level security;
```

---

## Future Enhancements (Post-MVP)

- Nested collections (folders within folders)
- Browser extension for quick access
- Mobile & desktop native apps
- Realtime collaboration
- AI-powered example generation
- Related prompts suggestions
- Authentication & multi-device sync
- Prompt versioning / history
- Bulk import/export (JSON, CSV)
- Keyboard shortcuts for power users
- Custom themes beyond dark/light
