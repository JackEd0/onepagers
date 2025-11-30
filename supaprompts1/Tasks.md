# SupaPrompts – Tasks

## Project Setup

- [x] Initialize Vue 3 project with Vite
- [x] Install and configure dependencies (Vue Router, Pinia, Supabase-js)
- [x] Set up Bootstrap 5 + Bootstrap Icons
- [x] Configure PWA plugin
- [x] Set up project folder structure

## Supabase Integration

- [x] Create Supabase client wrapper
- [x] Implement connection settings (URL + anon key)
- [x] Store settings in localStorage
- [x] Add connection status indicator

## Collections Feature

- [x] Create collections Pinia store
- [x] Implement collections CRUD operations
- [x] Build sidebar with collections list
- [x] Add drag & drop reordering
- [x] Create collection form modal (add/edit)
- [x] Add delete confirmation dialog

## Prompts Feature

- [x] Create prompts Pinia store
- [x] Implement prompts CRUD operations
- [x] Build prompt card component
- [x] Create prompt form modal (add/edit)
- [x] Add delete confirmation dialog
- [x] Implement favorite toggle
- [x] Add copy button with counter
- [x] Track last_copied_at timestamp

## Search & Filtering

- [x] Build centered search bar component
- [x] Implement keyboard shortcut (Ctrl+K / Ctrl+P)
- [x] Add full-text search across title, template, tags, description
- [x] Create tag filter (multi-select)
- [x] Add favorites-only filter
- [x] Add collection filter
- [x] Implement sort options (created, copied, most copied, title)

## Quick Use Feature

- [x] Parse `{{variable}}` placeholders from template
- [x] Build Quick Use modal with variable input fields
- [x] Implement variable replacement
- [x] Add copy final prompt button

## Sharing Feature

- [x] Generate shareable public link for prompts
- [x] Build public prompt view page
- [ ] Add "Add to my SupaPrompts" button (requires auth)
- [ ] Implement import from shared link (requires auth)

## Settings Page

- [x] Create settings view
- [x] Build Supabase credentials form
- [x] Add save/clear settings functionality
- [x] Display connection status

## UI/UX

- [x] Design Apple-inspired aesthetic (blurred backgrounds, large typography, whitespace, rounded corners)
- [x] Implement responsive layout (mobile-first)
- [x] Add dark mode toggle
- [x] Create smooth transitions and animations
- [ ] Build loading states and skeletons
- [x] Add empty states for lists
- [x] Implement toast notifications

## PWA

- [x] Configure manifest.json
- [ ] Add app icons (all sizes)
- [x] Set up service worker
- [ ] Test offline functionality
- [ ] Verify install prompt

## Testing & Polish

- [ ] Test all CRUD operations
- [ ] Verify search and filtering
- [ ] Test Quick Use with various variable patterns
- [ ] Check responsive design on multiple devices
- [ ] Test dark mode
- [ ] Verify PWA installation
- [ ] Cross-browser testing

## Deployment

- [ ] Configure build for production
- [ ] Set up deployment (Vercel/Netlify/Cloudflare)
- [ ] Test production build
- [ ] Create demo Supabase instance (optional)
