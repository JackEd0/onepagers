'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Collection, Prompt, Tag, Settings, initializeSettings } from './db';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useState } from 'react';

// Collections Hook
export function useCollections() {
  const collections = useLiveQuery(() => db.collections.orderBy('order').toArray(), []);

  const addCollection = useCallback(async (name: string, emoji: string = '📁') => {
    const maxOrder = collections?.length ? Math.max(...collections.map(c => c.order)) : -1;
    const collection: Collection = {
      id: uuidv4(),
      name,
      emoji,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collections.add(collection);
    return collection;
  }, [collections]);

  const updateCollection = useCallback(async (id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>) => {
    await db.collections.update(id, { ...updates, updatedAt: new Date() });
  }, []);

  const deleteCollection = useCallback(async (id: string) => {
    // Move prompts to uncategorized
    await db.prompts.where('collectionId').equals(id).modify({ collectionId: null });
    await db.collections.delete(id);
  }, []);

  const reorderCollections = useCallback(async (reorderedIds: string[]) => {
    await db.transaction('rw', db.collections, async () => {
      for (let i = 0; i < reorderedIds.length; i++) {
        await db.collections.update(reorderedIds[i], { order: i });
      }
    });
  }, []);

  return { collections: collections || [], addCollection, updateCollection, deleteCollection, reorderCollections };
}

// Prompts Hook
export interface PromptFilters {
  search: string;
  collectionId: string | null;
  tags: string[];
  favoritesOnly: boolean;
  sortBy: 'createdAt' | 'lastCopiedAt' | 'copyCount' | 'title';
  sortOrder: 'asc' | 'desc';
}

export function usePrompts(filters?: Partial<PromptFilters>) {
  const allPrompts = useLiveQuery(() => db.prompts.toArray(), []);

  const filteredPrompts = useLiveQuery(async () => {
    if (!allPrompts) return [];

    let results = [...allPrompts];

    // Filter by search
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.template.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Filter by collection (only when a specific collection ID is provided)
    if (filters?.collectionId) {
      results = results.filter(p => p.collectionId === filters.collectionId);
    }

    // Filter by tags
    if (filters?.tags?.length) {
      results = results.filter(p => filters.tags!.some(tag => p.tags.includes(tag)));
    }

    // Filter favorites only
    if (filters?.favoritesOnly) {
      results = results.filter(p => p.isFavorite);
    }

    // Sort
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'desc';
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'copyCount':
          comparison = a.copyCount - b.copyCount;
          break;
        case 'lastCopiedAt':
          const aTime = a.lastCopiedAt?.getTime() || 0;
          const bTime = b.lastCopiedAt?.getTime() || 0;
          comparison = aTime - bTime;
          break;
        case 'createdAt':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [allPrompts, filters?.search, filters?.collectionId, filters?.tags, filters?.favoritesOnly, filters?.sortBy, filters?.sortOrder]);

  const addPrompt = useCallback(async (data: Omit<Prompt, 'id' | 'copyCount' | 'lastCopiedAt' | 'createdAt' | 'updatedAt'>) => {
    const prompt: Prompt = {
      ...data,
      id: uuidv4(),
      copyCount: 0,
      lastCopiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.prompts.add(prompt);
    return prompt;
  }, []);

  const updatePrompt = useCallback(async (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
    await db.prompts.update(id, { ...updates, updatedAt: new Date() });
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    await db.prompts.delete(id);
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const prompt = await db.prompts.get(id);
    if (prompt) {
      await db.prompts.update(id, { isFavorite: !prompt.isFavorite, updatedAt: new Date() });
    }
  }, []);

  const incrementCopyCount = useCallback(async (id: string) => {
    const prompt = await db.prompts.get(id);
    if (prompt) {
      await db.prompts.update(id, {
        copyCount: prompt.copyCount + 1,
        lastCopiedAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, []);

  return {
    prompts: filteredPrompts || [],
    allPrompts: allPrompts || [],
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementCopyCount,
  };
}

// Tags Hook
export function useTags() {
  const tags = useLiveQuery(() => db.tags.toArray(), []);

  const addTag = useCallback(async (name: string, color: string = '#6c757d') => {
    const tag: Tag = { id: uuidv4(), name, color };
    await db.tags.add(tag);
    return tag;
  }, []);

  const updateTag = useCallback(async (id: string, updates: Partial<Omit<Tag, 'id'>>) => {
    await db.tags.update(id, updates);
  }, []);

  const deleteTag = useCallback(async (id: string) => {
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
  }, []);

  return { tags: tags || [], addTag, updateTag, deleteTag };
}

// Settings Hook
export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    initializeSettings().then(setSettings);
  }, []);

  const liveSettings = useLiveQuery(() => db.settings.get('main'), []);

  useEffect(() => {
    if (liveSettings) setSettings(liveSettings);
  }, [liveSettings]);

  const updateSettings = useCallback(async (updates: Partial<Omit<Settings, 'id'>>) => {
    await db.settings.update('main', updates);
  }, []);

  return { settings, updateSettings };
}
