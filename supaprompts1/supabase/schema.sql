-- SupaPrompts Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Collections table
create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Prompts table
create table if not exists prompts (
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

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
-- Supabase enables RLS by default. Without policies,
-- queries return empty results (not errors).
-- These policies allow public access for the anon key.

-- Enable RLS on tables
alter table collections enable row level security;
alter table prompts enable row level security;

-- Collections policies (allow all operations for anon users)
create policy "Allow public read access on collections"
  on collections for select
  using (true);

create policy "Allow public insert on collections"
  on collections for insert
  with check (true);

create policy "Allow public update on collections"
  on collections for update
  using (true);

create policy "Allow public delete on collections"
  on collections for delete
  using (true);

-- Prompts policies (allow all operations for anon users)
create policy "Allow public read access on prompts"
  on prompts for select
  using (true);

create policy "Allow public insert on prompts"
  on prompts for insert
  with check (true);

create policy "Allow public update on prompts"
  on prompts for update
  using (true);

create policy "Allow public delete on prompts"
  on prompts for delete
  using (true);

-- =====================================================
-- Indexes for better performance
-- =====================================================
create index if not exists idx_prompts_collection_id on prompts(collection_id);
create index if not exists idx_prompts_is_favorite on prompts(is_favorite);
create index if not exists idx_prompts_created_at on prompts(created_at desc);
create index if not exists idx_collections_sort_order on collections(sort_order);
