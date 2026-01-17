// Database Context - Provides database adapter based on selected mode
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DatabaseAdapter, DatabaseMode, Collection, Prompt, Tag } from './types';
import { LocalDatabaseAdapter } from './localAdapter';
import { createSupabaseAdapter, SupabaseDatabaseAdapter } from './supabaseAdapter';

interface DatabaseContextType {
  adapter: DatabaseAdapter;
  mode: DatabaseMode;
  setMode: (mode: DatabaseMode) => Promise<void>;
  isCloudAvailable: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  // Data state for reactive updates
  collections: Collection[];
  prompts: Prompt[];
  tags: Tag[];
  refreshData: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Storage key for database mode preference
const DB_MODE_KEY = 'neoprompts_db_mode';

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DatabaseMode>('local');
  const [localAdapter] = useState(() => new LocalDatabaseAdapter());
  const [cloudAdapter, setCloudAdapter] = useState<SupabaseDatabaseAdapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Data state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Initialize cloud adapter and load saved mode
  useEffect(() => {
    const cloud = createSupabaseAdapter();
    setCloudAdapter(cloud);

    // Load saved mode preference
    const savedMode = localStorage.getItem(DB_MODE_KEY) as DatabaseMode | null;
    if (savedMode && (savedMode === 'local' || savedMode === 'cloud')) {
      // Only use cloud if adapter is available
      if (savedMode === 'cloud' && cloud) {
        setModeState('cloud');
      } else {
        setModeState('local');
      }
    }

    setIsLoading(false);
  }, []);

  // Get current adapter based on mode
  const adapter: DatabaseAdapter = mode === 'cloud' && cloudAdapter ? cloudAdapter : localAdapter;

  // Refresh data from current adapter
  const refreshData = useCallback(async () => {
    try {
      const [cols, proms, tgs] = await Promise.all([
        adapter.getCollections(),
        adapter.getPrompts(),
        adapter.getTags(),
      ]);
      setCollections(cols);
      setPrompts(proms);
      setTags(tgs);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  }, [adapter]);

  // Load data when mode or adapter changes
  useEffect(() => {
    if (!isLoading) {
      refreshData();
    }
  }, [mode, isLoading, refreshData]);

  // Subscribe to real-time updates for cloud mode
  useEffect(() => {
    if (mode === 'cloud' && cloudAdapter) {
      const unsubscribe = cloudAdapter.subscribeToChanges(() => {
        refreshData();
      });
      return unsubscribe;
    }
  }, [mode, cloudAdapter, refreshData]);

  // Switch database mode
  const setMode = async (newMode: DatabaseMode) => {
    if (newMode === 'cloud' && !cloudAdapter) {
      throw new Error('Cloud database is not configured');
    }

    setModeState(newMode);
    localStorage.setItem(DB_MODE_KEY, newMode);
  };

  // Sync local data to cloud
  const syncToCloud = async () => {
    if (!cloudAdapter) throw new Error('Cloud database is not configured');

    setIsSyncing(true);
    try {
      const localData = await localAdapter.exportData();
      await cloudAdapter.importData(localData);
      if (mode === 'cloud') {
        await refreshData();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync cloud data to local
  const syncFromCloud = async () => {
    if (!cloudAdapter) throw new Error('Cloud database is not configured');

    setIsSyncing(true);
    try {
      const cloudData = await cloudAdapter.exportData();
      await localAdapter.importData(cloudData);
      if (mode === 'local') {
        await refreshData();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        adapter,
        mode,
        setMode,
        isCloudAvailable: !!cloudAdapter,
        isLoading,
        isSyncing,
        syncToCloud,
        syncFromCloud,
        collections,
        prompts,
        tags,
        refreshData,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
