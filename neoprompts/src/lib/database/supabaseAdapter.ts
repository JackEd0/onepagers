// Supabase Database Adapter
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseAdapter, Collection, Prompt, Tag, Settings } from './types';

// Row types for database tables
interface CollectionRow {
  id: string;
  name: string;
  emoji: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PromptRow {
  id: string;
  title: string;
  template: string;
  description: string;
  tags: string[];
  collection_id: string | null;
  is_favorite: boolean;
  copy_count: number;
  last_copied_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TagRow {
  id: string;
  name: string;
  color: string;
}

interface SettingsRow {
  id: string;
  theme: string;
  sidebar_collapsed: boolean;
  database_mode: string;
}

// Transform functions between Supabase snake_case and app camelCase
function toCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    template: row.template,
    description: row.description,
    tags: row.tags || [],
    collectionId: row.collection_id,
    isFavorite: row.is_favorite,
    copyCount: row.copy_count,
    lastCopiedAt: row.last_copied_at ? new Date(row.last_copied_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

export class SupabaseDatabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient;
  private subscriptions: (() => void)[] = [];

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    const { data, error } = await this.client
      .from('collections')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return ((data || []) as CollectionRow[]).map(toCollection);
  }

  async addCollection(collection: Omit<Collection, 'id'> & { id?: string }): Promise<Collection> {
    const insertData: Record<string, unknown> = {
      name: collection.name,
      emoji: collection.emoji,
      order: collection.order,
    };

    if (collection.id) {
      insertData.id = collection.id;
    }

    const { data, error } = await this.client
      .from('collections')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toCollection(data as CollectionRow);
  }

  async updateCollection(id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>): Promise<void> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.emoji !== undefined) updateData.emoji = updates.emoji;
    if (updates.order !== undefined) updateData.order = updates.order;

    const { error } = await this.client
      .from('collections')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteCollection(id: string): Promise<void> {
    // First, move prompts to uncategorized
    await this.client
      .from('prompts')
      .update({ collection_id: null })
      .eq('collection_id', id);

    const { error } = await this.client
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Prompts
  async getPrompts(): Promise<Prompt[]> {
    const { data, error } = await this.client
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ((data || []) as PromptRow[]).map(toPrompt);
  }

  async addPrompt(prompt: Omit<Prompt, 'id'> & { id?: string }): Promise<Prompt> {
    const insertData: Record<string, unknown> = {
      title: prompt.title,
      template: prompt.template,
      description: prompt.description,
      tags: prompt.tags,
      collection_id: prompt.collectionId,
      is_favorite: prompt.isFavorite,
      copy_count: prompt.copyCount,
      last_copied_at: prompt.lastCopiedAt?.toISOString() || null,
    };

    if (prompt.id) {
      insertData.id = prompt.id;
    }

    const { data, error } = await this.client
      .from('prompts')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toPrompt(data as PromptRow);
  }

  async updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Promise<void> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.template !== undefined) updateData.template = updates.template;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.collectionId !== undefined) updateData.collection_id = updates.collectionId;
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
    if (updates.copyCount !== undefined) updateData.copy_count = updates.copyCount;
    if (updates.lastCopiedAt !== undefined) {
      updateData.last_copied_at = updates.lastCopiedAt?.toISOString() || null;
    }

    const { error } = await this.client
      .from('prompts')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deletePrompt(id: string): Promise<void> {
    const { error } = await this.client
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const { data, error } = await this.client
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return ((data || []) as TagRow[]).map(toTag);
  }

  async addTag(tag: Omit<Tag, 'id'> & { id?: string }): Promise<Tag> {
    const insertData: Record<string, unknown> = {
      name: tag.name,
      color: tag.color,
    };

    if (tag.id) {
      insertData.id = tag.id;
    }

    const { data, error } = await this.client
      .from('tags')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return toTag(data as TagRow);
  }

  async updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Promise<void> {
    const updateData: Record<string, unknown> = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;

    const { error } = await this.client
      .from('tags')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteTag(id: string): Promise<void> {
    // First get the tag name to remove from prompts
    const { data: tag, error: tagError } = await this.client
      .from('tags')
      .select('name')
      .eq('id', id)
      .single();

    if (tagError) throw tagError;
    const tagData = tag as TagRow;

    // Get prompts that have this tag
    const { data: prompts, error: promptsError } = await this.client
      .from('prompts')
      .select('id, tags')
      .contains('tags', [tagData.name]);

    if (promptsError) throw promptsError;

    // Remove tag from each prompt
    for (const prompt of (prompts || []) as PromptRow[]) {
      await this.client
        .from('prompts')
        .update({ tags: prompt.tags.filter((t: string) => t !== tagData.name) })
        .eq('id', prompt.id);
    }

    // Delete the tag
    const { error } = await this.client
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    const { data, error } = await this.client
      .from('settings')
      .select('*')
      .eq('id', 'app-settings')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    const row = data as SettingsRow;
    return {
      id: row.id,
      theme: row.theme as 'light' | 'dark' | 'system',
      sidebarCollapsed: row.sidebar_collapsed,
    };
  }

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    const upsertData: Record<string, unknown> = {
      id: 'app-settings',
    };

    if (settings.theme !== undefined) upsertData.theme = settings.theme;
    if (settings.sidebarCollapsed !== undefined) upsertData.sidebar_collapsed = settings.sidebarCollapsed;

    const { error } = await this.client
      .from('settings')
      .upsert(upsertData);

    if (error) throw error;
  }

  // Real-time subscriptions
  subscribeToChanges(callback: () => void): () => void {
    const channel = this.client.channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prompts' }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, callback)
      .subscribe();

    const unsubscribe = () => {
      this.client.removeChannel(channel);
    };

    this.subscriptions.push(unsubscribe);
    return unsubscribe;
  }

  // Bulk operations for syncing
  async bulkAddCollections(collections: Collection[]): Promise<void> {
    const rows = collections.map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      order: c.order,
      created_at: c.createdAt.toISOString(),
      updated_at: c.updatedAt.toISOString(),
    }));

    const { error } = await this.client
      .from('collections')
      .upsert(rows);

    if (error) throw error;
  }

  async bulkAddPrompts(prompts: Prompt[]): Promise<void> {
    const rows = prompts.map(p => ({
      id: p.id,
      title: p.title,
      template: p.template,
      description: p.description,
      tags: p.tags,
      collection_id: p.collectionId,
      is_favorite: p.isFavorite,
      copy_count: p.copyCount,
      last_copied_at: p.lastCopiedAt?.toISOString() || null,
      created_at: p.createdAt.toISOString(),
      updated_at: p.updatedAt.toISOString(),
    }));

    const { error } = await this.client
      .from('prompts')
      .upsert(rows);

    if (error) throw error;
  }

  async bulkAddTags(tags: Tag[]): Promise<void> {
    const rows = tags.map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
    }));

    const { error } = await this.client
      .from('tags')
      .upsert(rows);

    if (error) throw error;
  }

  async clearAll(): Promise<void> {
    // Delete in order to respect foreign keys
    await this.client.from('prompts').delete().neq('id', '');
    await this.client.from('collections').delete().neq('id', '');
    await this.client.from('tags').delete().neq('id', '');
    await this.client.from('settings').delete().neq('id', '');
  }

  // Export/Import
  async exportData(): Promise<{ collections: Collection[]; prompts: Prompt[]; tags: Tag[] }> {
    const [collections, prompts, tags] = await Promise.all([
      this.getCollections(),
      this.getPrompts(),
      this.getTags(),
    ]);

    return { collections, prompts, tags };
  }

  async importData(data: { collections: Collection[]; prompts: Prompt[]; tags: Tag[] }): Promise<void> {
    await this.clearAll();
    await this.bulkAddTags(data.tags);
    await this.bulkAddCollections(data.collections);
    await this.bulkAddPrompts(data.prompts);
  }

  dispose(): void {
    this.subscriptions.forEach(unsub => unsub());
    this.subscriptions = [];
  }
}

// Factory function to create Supabase adapter
export function createSupabaseAdapter(): SupabaseDatabaseAdapter | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Cloud database unavailable.');
    return null;
  }

  return new SupabaseDatabaseAdapter(supabaseUrl, supabaseKey);
}
