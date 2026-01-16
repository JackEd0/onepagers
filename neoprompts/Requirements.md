# NeoPrompts Requirements

## Core Features

### 1. Search & Discovery
- [ ] Huge centered search bar with keyboard shortcut (Ctrl+K or Ctrl+P)
- [ ] Instant full-text search across title, template, tags, and description
- [ ] Filter by: Tags (multi-select) | Favorites only | Collection
- [ ] Sort by: Last created | Last copied | Most copied | Title A–Z

### 2. Collections
- [ ] Flat list displayed in sidebar
- [ ] Drag & drop to reorder collections
- [ ] CRUD operations (create, read, update, delete)
- [ ] Collection icon/emoji support

### 3. Prompts
- [ ] Card view with: Title, Preview, Tags, Favorite star, Copy button
- [ ] CRUD operations (create, read, update, delete)
- [ ] Support for `{{variable}}` placeholders
- [ ] Copy counter tracking
- [ ] Last copied timestamp

### 4. Quick Use Modal
- [ ] Detect `{{variables}}` in prompt template
- [ ] Generate form fields for each variable
- [ ] Preview rendered prompt
- [ ] Copy final rendered prompt to clipboard

### 5. Settings
- [ ] Theme toggle (light/dark/system)
- [ ] Export prompts and collections to JSON
- [ ] Import prompts and collections from JSON
- [ ] Clear all data button

### 6. UI/UX
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support
- [ ] Apple-inspired aesthetic (blur, typography, whitespace, rounded corners)
- [ ] Toast notifications for actions
- [ ] Smooth animations and transitions

## Technical Requirements

### Dependencies
- Next.js 14+ (App Router)
- Bootstrap 5.3+
- Bootstrap Icons
- Dexie.js (IndexedDB wrapper)
- react-beautiful-dnd (drag & drop)

### Data Models

#### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  emoji?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Prompt
```typescript
interface Prompt {
  id: string;
  title: string;
  template: string;
  description?: string;
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  copyCount: number;
  lastCopiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  color?: string;
}
```

### Browser Compatibility
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Future Enhancements
- [ ] Prompt versioning/history
- [ ] Nested collections
- [ ] Prompt sharing via URL
- [ ] Cloud sync option
- [ ] AI-powered prompt suggestions
- [ ] Markdown support in descriptions
