# AI Agent Guidelines

AI agents rely on this file (AGENTS.md) to understand the project and continue work effectively.

## Rules

- Keep all documents and comments inside the project concise and actionable.
- Always look for guides in the folder `documentation` when working with external libraries.
- Always use the Context7 MCP tools to resolve library ids and get up-to-date docs before any code generation or configuration.

## Project Overview

**NeoPrompts** is a personal AI prompt manager web application built with Next.js, Bootstrap 5, and IndexedDB (via Dexie.js). It provides a fast, beautiful, private prompt library with an Apple-inspired aesthetic.

### Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Bootstrap 5.3 + Custom Apple-inspired CSS
- **Database**: IndexedDB via Dexie.js (local, private)
- **State Management**: React Context + Custom Hooks
- **Icons**: Bootstrap Icons

### Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   ├── providers.tsx       # Client-side providers wrapper
│   └── globals.css         # Apple-inspired design system
├── components/
│   ├── FilterBar.tsx       # Tag filtering and sorting
│   ├── PromptCard.tsx      # Prompt display card
│   ├── PromptModal.tsx     # Create/edit prompt modal
│   ├── QuickUseModal.tsx   # Variable filling modal
│   ├── SearchBar.tsx       # Global search with shortcuts
│   ├── SettingsModal.tsx   # Settings and data management
│   ├── Sidebar.tsx         # Collections navigation
│   └── ToastContainer.tsx  # Toast notifications
├── contexts/
│   ├── ThemeContext.tsx    # Theme management
│   └── ToastContext.tsx    # Toast notifications
└── lib/
    ├── db.ts               # Dexie database schema
    ├── hooks.ts            # Custom React hooks
    └── utils.ts            # Utility functions
```

## Requirements

See `Requirements.md` for detailed feature requirements and data models.

## Core Files

1. `README.md`: Project overview, installation, and usage instructions.
2. `Requirements.md`: Core features, technical requirements (dependencies, stack, compatibility), and future enhancements.
3. `Tasks.md`: Project tasks with ID numbers, checkboxes [ ] and [x] for completion tracking.
4. `Troubleshooting.md` (optional): Common issues, solutions, and debugging steps.
