// Local Database Adapter using Dexie.js (IndexedDB)
import { db, Collection, Prompt, Tag, Settings } from '../db';
import { DatabaseAdapter } from './types';
import { v4 as uuidv4 } from 'uuid';

export class LocalDatabaseAdapter implements DatabaseAdapter {
  // Collections
  async getCollections(): Promise<Collection[]> {
    return db.collections.orderBy('order').toArray();
  }

  async addCollection(collection: Omit<Collection, 'id'> & { id?: string }): Promise<Collection> {
    const newCollection: Collection = {
      ...collection,
      id: collection.id || uuidv4(),
    };
    await db.collections.add(newCollection);
    return newCollection;
  }

  async updateCollection(id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>): Promise<void> {
    await db.collections.update(id, { ...updates, updatedAt: new Date() });
  }

  async deleteCollection(id: string): Promise<void> {
    // Move prompts to uncategorized
    await db.prompts.where('collectionId').equals(id).modify({ collectionId: null });
    await db.collections.delete(id);
  }

  // Prompts
  async getPrompts(): Promise<Prompt[]> {
    return db.prompts.toArray();
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    return db.prompts.get(id);
  }

  async addPrompt(prompt: Omit<Prompt, 'id'> & { id?: string }): Promise<Prompt> {
    const newPrompt: Prompt = {
      ...prompt,
      id: prompt.id || uuidv4(),
    };
    await db.prompts.add(newPrompt);
    return newPrompt;
  }

  async updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Promise<void> {
    await db.prompts.update(id, { ...updates, updatedAt: new Date() });
  }

  async deletePrompt(id: string): Promise<void> {
    await db.prompts.delete(id);
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return db.tags.toArray();
  }

  async addTag(tag: Omit<Tag, 'id'> & { id?: string }): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: tag.id || uuidv4(),
    };
    await db.tags.add(newTag);
    return newTag;
  }

  async updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Promise<void> {
    await db.tags.update(id, updates);
  }

  async deleteTag(id: string): Promise<void> {
    // Remove tag from all prompts
    const tag = await db.tags.get(id);
    if (tag) {
      const promptsWithTag = await db.prompts.where('tags').equals(tag.name).toArray();
      for (const prompt of promptsWithTag) {
        await db.prompts.update(prompt.id, {
          tags: prompt.tags.filter(t => t !== tag.name),
        });
      }
    }
    await db.tags.delete(id);
  }

  // Settings
  async getSettings(): Promise<Settings | null> {
    const settings = await db.settings.get('main');
    return settings || null;
  }

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    const existing = await db.settings.get('main');
    if (existing) {
      await db.settings.update('main', settings);
    } else {
      await db.settings.add({
        id: 'main',
        theme: 'system',
        sidebarCollapsed: false,
        ...settings,
      } as Settings);
    }
  }

  // Data management
  async exportData(): Promise<{ collections: Collection[]; prompts: Prompt[]; tags: Tag[] }> {
    const collections = await db.collections.toArray();
    const prompts = await db.prompts.toArray();
    const tags = await db.tags.toArray();

    return { collections, prompts, tags };
  }

  async importData(data: { collections: Collection[]; prompts: Prompt[]; tags: Tag[] }): Promise<void> {
    // Clear existing data
    await db.collections.clear();
    await db.prompts.clear();
    await db.tags.clear();

    if (data.collections?.length) {
      await db.collections.bulkAdd(data.collections.map((c: Collection) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      })));
    }

    if (data.prompts?.length) {
      await db.prompts.bulkAdd(data.prompts.map((p: Prompt) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        lastCopiedAt: p.lastCopiedAt ? new Date(p.lastCopiedAt) : null,
      })));
    }

    if (data.tags?.length) {
      await db.tags.bulkAdd(data.tags);
    }
  }

  async clearAll(): Promise<void> {
    await db.collections.clear();
    await db.prompts.clear();
    await db.tags.clear();
  }

  // Subscription using Dexie's liveQuery would be handled at hook level
  subscribeToChanges(callback: () => void): () => void {
    // For local DB, we rely on Dexie's useLiveQuery
    // This is a no-op placeholder
    return () => {};
  }
}

export const localDb = new LocalDatabaseAdapter();
