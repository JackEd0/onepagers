import Dexie, { type EntityTable } from 'dexie';

// Types
export interface Collection {
  id: string;
  name: string;
  emoji: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: string;
  title: string;
  template: string;
  description: string;
  tags: string[];
  collectionId: string | null;
  isFavorite: boolean;
  copyCount: number;
  lastCopiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}

// Database
const db = new Dexie('NeoPromptsDB') as Dexie & {
  collections: EntityTable<Collection, 'id'>;
  prompts: EntityTable<Prompt, 'id'>;
  tags: EntityTable<Tag, 'id'>;
  settings: EntityTable<Settings, 'id'>;
};

db.version(1).stores({
  collections: 'id, name, order, createdAt',
  prompts: 'id, title, collectionId, isFavorite, copyCount, lastCopiedAt, createdAt, *tags',
  tags: 'id, name',
  settings: 'id',
});

export { db };

// Helper functions
export async function initializeSettings(): Promise<Settings> {
  const existing = await db.settings.get('main');
  if (existing) return existing;

  const defaultSettings: Settings = {
    id: 'main',
    theme: 'system',
    sidebarCollapsed: false,
  };
  await db.settings.add(defaultSettings);
  return defaultSettings;
}

export async function exportData(): Promise<string> {
  const collections = await db.collections.toArray();
  const prompts = await db.prompts.toArray();
  const tags = await db.tags.toArray();

  return JSON.stringify({ collections, prompts, tags, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importData(jsonString: string): Promise<{ collections: number; prompts: number; tags: number }> {
  const data = JSON.parse(jsonString);

  // Clear existing data
  await db.collections.clear();
  await db.prompts.clear();
  await db.tags.clear();

  // Import new data
  let collectionsCount = 0;
  let promptsCount = 0;
  let tagsCount = 0;

  if (data.collections?.length) {
    await db.collections.bulkAdd(data.collections.map((c: Collection) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    })));
    collectionsCount = data.collections.length;
  }

  if (data.prompts?.length) {
    await db.prompts.bulkAdd(data.prompts.map((p: Prompt) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      lastCopiedAt: p.lastCopiedAt ? new Date(p.lastCopiedAt) : null,
    })));
    promptsCount = data.prompts.length;
  }

  if (data.tags?.length) {
    await db.tags.bulkAdd(data.tags);
    tagsCount = data.tags.length;
  }

  return { collections: collectionsCount, prompts: promptsCount, tags: tagsCount };
}

export async function clearAllData(): Promise<void> {
  await db.collections.clear();
  await db.prompts.clear();
  await db.tags.clear();
}
