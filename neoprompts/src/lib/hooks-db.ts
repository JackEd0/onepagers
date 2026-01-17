'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useDatabase } from './database';
import { Collection, Prompt, Tag, Settings } from './database/types';

// Collections Hook using Database Context
export function useCollections() {
  const { adapter, collections, refreshData } = useDatabase();

  const addCollection = useCallback(async (name: string, emoji: string = '📁') => {
    const maxOrder = collections.length ? Math.max(...collections.map(c => c.order)) : -1;
    const collection = await adapter.addCollection({
      name,
      emoji,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await refreshData();
    return collection;
  }, [adapter, collections, refreshData]);

  const updateCollection = useCallback(async (id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>) => {
    await adapter.updateCollection(id, updates);
    await refreshData();
  }, [adapter, refreshData]);

  const deleteCollection = useCallback(async (id: string) => {
    await adapter.deleteCollection(id);
    await refreshData();
  }, [adapter, refreshData]);

  const reorderCollections = useCallback(async (reorderedIds: string[]) => {
    for (let i = 0; i < reorderedIds.length; i++) {
      await adapter.updateCollection(reorderedIds[i], { order: i });
    }
    await refreshData();
  }, [adapter, refreshData]);

  return { collections, addCollection, updateCollection, deleteCollection, reorderCollections };
}

// Prompts Hook using Database Context
export interface PromptFilters {
  search: string;
  collectionId: string | null;
  tags: string[];
  favoritesOnly: boolean;
  sortBy: 'createdAt' | 'lastCopiedAt' | 'copyCount' | 'title';
  sortOrder: 'asc' | 'desc';
}

export function usePrompts(filters?: Partial<PromptFilters>) {
  const { adapter, prompts: allPrompts, refreshData } = useDatabase();

  const filteredPrompts = useMemo(() => {
    let results = [...allPrompts];

    // Filter by search
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.template.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some((t: string) => t.toLowerCase().includes(searchLower))
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
    const prompt = await adapter.addPrompt({
      ...data,
      copyCount: 0,
      lastCopiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await refreshData();
    return prompt;
  }, [adapter, refreshData]);

  const updatePrompt = useCallback(async (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
    await adapter.updatePrompt(id, updates);
    await refreshData();
  }, [adapter, refreshData]);

  const deletePrompt = useCallback(async (id: string) => {
    await adapter.deletePrompt(id);
    await refreshData();
  }, [adapter, refreshData]);

  const toggleFavorite = useCallback(async (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      await adapter.updatePrompt(id, { isFavorite: !prompt.isFavorite });
      await refreshData();
    }
  }, [adapter, allPrompts, refreshData]);

  const incrementCopyCount = useCallback(async (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      await adapter.updatePrompt(id, {
        copyCount: prompt.copyCount + 1,
        lastCopiedAt: new Date(),
      });
      await refreshData();
    }
  }, [adapter, allPrompts, refreshData]);

  return {
    prompts: filteredPrompts,
    allPrompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementCopyCount,
  };
}

// Tags Hook using Database Context
export function useTags() {
  const { adapter, tags, refreshData } = useDatabase();

  const addTag = useCallback(async (name: string, color: string = '#6c757d') => {
    const tag = await adapter.addTag({ name, color });
    await refreshData();
    return tag;
  }, [adapter, refreshData]);

  const updateTag = useCallback(async (id: string, updates: Partial<Omit<Tag, 'id'>>) => {
    await adapter.updateTag(id, updates);
    await refreshData();
  }, [adapter, refreshData]);

  const deleteTag = useCallback(async (id: string) => {
    await adapter.deleteTag(id);
    await refreshData();
  }, [adapter, refreshData]);

  return { tags, addTag, updateTag, deleteTag };
}

// Settings Hook using Database Context
export function useSettings() {
  const { adapter, refreshData } = useDatabase();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    adapter.getSettings().then(s => {
      if (s) {
        setSettings(s);
      } else {
        // Initialize default settings
        const defaultSettings: Settings = {
          id: 'main',
          theme: 'system',
          sidebarCollapsed: false,
        };
        setSettings(defaultSettings);
      }
    });
  }, [adapter]);

  const updateSettings = useCallback(async (updates: Partial<Omit<Settings, 'id'>>) => {
    await adapter.saveSettings(updates);
    const newSettings = await adapter.getSettings();
    setSettings(newSettings);
  }, [adapter]);

  return { settings, updateSettings };
}
