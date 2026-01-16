'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import PromptCard from '@/components/PromptCard';
import PromptModal from '@/components/PromptModal';
import QuickUseModal from '@/components/QuickUseModal';
import SettingsModal from '@/components/SettingsModal';
import ToastContainer from '@/components/ToastContainer';
import { usePrompts, useCollections, PromptFilters } from '@/lib/hooks';
import { Prompt } from '@/lib/db';
import { useToast } from '@/contexts/ToastContext';
import { seedSampleData } from '@/lib/sampleData';

export default function Home() {
  const { showToast } = useToast();
  const { collections } = useCollections();
  const [isSeeding, setIsSeeding] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<PromptFilters['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<PromptFilters['sortOrder']>('desc');

  // Modal state
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [quickUsePrompt, setQuickUsePrompt] = useState<Prompt | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prompts with filters
  const filters: Partial<PromptFilters> = {
    search,
    collectionId: showingFavorites ? undefined : selectedCollectionId,
    tags: selectedTags,
    favoritesOnly: showingFavorites,
    sortBy,
    sortOrder,
  };

  const { prompts, addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementCopyCount } = usePrompts(filters);

  // Seed sample data on first load
  useEffect(() => {
    seedSampleData().then((result) => {
      if (result.prompts > 0) {
        showToast(`Loaded ${result.prompts} sample prompts!`, 'success');
      }
      setIsSeeding(false);
    }).catch(() => {
      setIsSeeding(false);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingPrompt(null);
        setIsPromptModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCollection = (id: string | null) => {
    setSelectedCollectionId(id);
    setShowingFavorites(false);
    setSidebarOpen(false);
  };

  const handleShowFavorites = () => {
    setShowingFavorites(true);
    setSelectedCollectionId(null);
    setSidebarOpen(false);
  };

  const handleNewPrompt = () => {
    setEditingPrompt(null);
    setIsPromptModalOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsPromptModalOpen(true);
  };

  const handleSavePrompt = useCallback(async (data: Omit<Prompt, 'id' | 'copyCount' | 'lastCopiedAt' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingPrompt) {
        await updatePrompt(editingPrompt.id, data);
        showToast('Prompt updated!', 'success');
      } else {
        await addPrompt(data);
        showToast('Prompt created!', 'success');
      }
    } catch (error) {
      showToast('Failed to save prompt', 'error');
    }
  }, [editingPrompt, addPrompt, updatePrompt, showToast]);

  const handleDeletePrompt = useCallback(async (id: string) => {
    if (confirm('Delete this prompt?')) {
      try {
        await deletePrompt(id);
        showToast('Prompt deleted', 'success');
      } catch (error) {
        showToast('Failed to delete prompt', 'error');
      }
    }
  }, [deletePrompt, showToast]);

  const handleUsePrompt = (prompt: Prompt) => {
    setQuickUsePrompt(prompt);
  };

  const handleCopied = useCallback(async (id: string) => {
    await incrementCopyCount(id);
  }, [incrementCopyCount]);

  // Get current view title
  const getViewTitle = () => {
    if (showingFavorites) return '⭐ Favorites';
    if (selectedCollectionId) {
      const collection = collections.find(c => c.id === selectedCollectionId);
      return collection ? `${collection.emoji} ${collection.name}` : 'All Prompts';
    }
    return '📋 All Prompts';
  };

  return (
    <div className="app-container">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar
          selectedCollectionId={selectedCollectionId}
          onSelectCollection={handleSelectCollection}
          onShowFavorites={handleShowFavorites}
          showingFavorites={showingFavorites}
        />
      </div>

      {/* Main content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link d-lg-none mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
            <h2 className="mb-0">{getViewTitle()}</h2>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={handleNewPrompt}
            >
              <i className="bi bi-plus-lg me-1"></i>
              <span className="d-none d-sm-inline">New Prompt</span>
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              <i className="bi bi-gear"></i>
            </button>
          </div>
        </header>

        {/* Search */}
        <div className="search-section">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search prompts, tags, descriptions..."
          />
        </div>

        {/* Filters */}
        <FilterBar
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />

        {/* Prompts Grid */}
        <div className="prompts-section">
          {prompts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {search ? '🔍' : '✨'}
              </div>
              <h4>{search ? 'No prompts found' : 'No prompts yet'}</h4>
              <p className="text-muted">
                {search
                  ? 'Try a different search term or clear filters'
                  : 'Create your first prompt to get started'}
              </p>
              {!search && (
                <button className="btn btn-primary" onClick={handleNewPrompt}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Create Prompt
                </button>
              )}
            </div>
          ) : (
            <div className="prompts-grid">
              {prompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={handleEditPrompt}
                  onDelete={handleDeletePrompt}
                  onToggleFavorite={toggleFavorite}
                  onUse={handleUsePrompt}
                  onCopy={handleCopied}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <PromptModal
        prompt={editingPrompt}
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSave={handleSavePrompt}
        defaultCollectionId={showingFavorites ? null : selectedCollectionId}
      />

      <QuickUseModal
        prompt={quickUsePrompt}
        isOpen={!!quickUsePrompt}
        onClose={() => setQuickUsePrompt(null)}
        onCopied={handleCopied}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}
