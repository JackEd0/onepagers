// Database Abstraction Layer - Types and Interface
import { Collection, Prompt, Tag, Settings } from '../db';

// Re-export types for convenience
export type { Collection, Prompt, Tag, Settings };

// Database adapter interface
export interface DatabaseAdapter {
  // Collections
  getCollections(): Promise<Collection[]>;
  addCollection(collection: Omit<Collection, 'id'> & { id?: string }): Promise<Collection>;
  updateCollection(id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>): Promise<void>;
  deleteCollection(id: string): Promise<void>;

  // Prompts
  getPrompts(): Promise<Prompt[]>;
  getPrompt?(id: string): Promise<Prompt | undefined>;
  addPrompt(prompt: Omit<Prompt, 'id'> & { id?: string }): Promise<Prompt>;
  updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Promise<void>;
  deletePrompt(id: string): Promise<void>;

  // Tags
  getTags(): Promise<Tag[]>;
  addTag(tag: Omit<Tag, 'id'> & { id?: string }): Promise<Tag>;
  updateTag(id: string, updates: Partial<Omit<Tag, 'id'>>): Promise<void>;
  deleteTag(id: string): Promise<void>;

  // Settings
  getSettings(): Promise<Settings | null>;
  saveSettings(settings: Partial<Settings>): Promise<void>;

  // Data management
  exportData(): Promise<{ collections: Collection[]; prompts: Prompt[]; tags: Tag[] }>;
  importData(data: { collections: Collection[]; prompts: Prompt[]; tags: Tag[] }): Promise<void>;
  clearAll(): Promise<void>;

  // Subscription for real-time updates (optional)
  subscribeToChanges?(callback: () => void): () => void;

  // Cleanup
  dispose?(): void;
}

// Database mode type
export type DatabaseMode = 'local' | 'cloud';

// Extended settings with database mode
export interface AppSettings extends Settings {
  databaseMode: DatabaseMode;
}
