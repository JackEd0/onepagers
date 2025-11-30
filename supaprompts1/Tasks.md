# SupaPrompts – Tasks

## Project Setup

- [ ] Initialize Vue 3 project with Vite
- [ ] Install and configure dependencies (Vue Router, Pinia, Supabase-js)
- [ ] Set up Bootstrap 5 + Bootstrap Icons
- [ ] Configure PWA plugin
- [ ] Set up project folder structure

## Supabase Integration

- [ ] Create Supabase client wrapper
- [ ] Implement connection settings (URL + anon key)
- [ ] Store settings in localStorage
- [ ] Add connection status indicator

## Collections Feature

- [ ] Create collections Pinia store
- [ ] Implement collections CRUD operations
- [ ] Build sidebar with collections list
- [ ] Add drag & drop reordering
- [ ] Create collection form modal (add/edit)
- [ ] Add delete confirmation dialog

## Prompts Feature

- [ ] Create prompts Pinia store
- [ ] Implement prompts CRUD operations
- [ ] Build prompt card component
- [ ] Create prompt form modal (add/edit)
- [ ] Add delete confirmation dialog
- [ ] Implement favorite toggle
- [ ] Add copy button with counter
- [ ] Track last_copied_at timestamp

## Search & Filtering

- [ ] Build centered search bar component
- [ ] Implement keyboard shortcut (Ctrl+K / Ctrl+P)
- [ ] Add full-text search across title, template, tags, description
- [ ] Create tag filter (multi-select)
- [ ] Add favorites-only filter
- [ ] Add collection filter
- [ ] Implement sort options (created, copied, most copied, title)

## Quick Use Feature

- [ ] Parse `{{variable}}` placeholders from template
- [ ] Build Quick Use modal with variable input fields
- [ ] Implement variable replacement
- [ ] Add copy final prompt button

## Sharing Feature

- [ ] Generate shareable public link for prompts
- [ ] Build public prompt view page
- [ ] Add "Add to my SupaPrompts" button
- [ ] Implement import from shared link

## Settings Page

- [ ] Create settings view
- [ ] Build Supabase credentials form
- [ ] Add save/clear settings functionality
- [ ] Display connection status

## UI/UX

- [ ] Design Apple-inspired aesthetic (blurred backgrounds, large typography, whitespace, rounded corners)
- [ ] Implement responsive layout (mobile-first)
- [ ] Add dark mode toggle
- [ ] Create smooth transitions and animations
- [ ] Build loading states and skeletons
- [ ] Add empty states for lists
- [ ] Implement toast notifications

## PWA

- [ ] Configure manifest.json
- [ ] Add app icons (all sizes)
- [ ] Set up service worker
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
