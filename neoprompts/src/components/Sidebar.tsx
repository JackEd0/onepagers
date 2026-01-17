'use client';

import { useState, useCallback } from 'react';
import { useCollections } from '@/lib/hooks';
import { Collection } from '@/lib/db';

interface SidebarProps {
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onShowFavorites: () => void;
  showingFavorites: boolean;
}

export default function Sidebar({
  selectedCollectionId,
  onSelectCollection,
  onShowFavorites,
  showingFavorites,
}: SidebarProps) {
  const { collections, addCollection, updateCollection, deleteCollection, reorderCollections } = useCollections();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📁');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (newName.trim()) {
      await addCollection(newName.trim(), newEmoji);
      setNewName('');
      setNewEmoji('📁');
      setIsAdding(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (editName.trim()) {
      await updateCollection(id, { name: editName.trim(), emoji: editEmoji });
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this collection? Prompts will be moved to "All Prompts".')) {
      await deleteCollection(id);
      if (selectedCollectionId === id) {
        onSelectCollection(null);
      }
    }
  };

  const startEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setEditName(collection.name);
    setEditEmoji(collection.emoji);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = useCallback(async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const newOrder = collections.map(c => c.id);
    const draggedIndex = newOrder.indexOf(draggedId);
    const targetIndex = newOrder.indexOf(targetId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedId);

    await reorderCollections(newOrder);
    setDraggedId(null);
  }, [draggedId, collections, reorderCollections]);

  const emojis = ['📁', '💡', '🚀', '💻', '📝', '🎨', '✨', '🔥', '💎', '🌟', '📚', '🛠️'];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="d-flex align-items-center gap-2">
          <span className="sidebar-logo">⚡</span>
          <h1 className="sidebar-title">NeoPrompts</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* All Prompts */}
        <button
          className={`sidebar-item ${selectedCollectionId === null && !showingFavorites ? 'active' : ''}`}
          onClick={() => { onSelectCollection(null); }}
        >
          <span className="sidebar-item-emoji">📋</span>
          <span className="sidebar-item-text">All Prompts</span>
        </button>

        {/* Favorites */}
        <button
          className={`sidebar-item ${showingFavorites ? 'active' : ''}`}
          onClick={onShowFavorites}
        >
          <span className="sidebar-item-emoji">⭐</span>
          <span className="sidebar-item-text">Favorites</span>
        </button>

        <div className="sidebar-divider"></div>

        {/* Collections Header */}
        <div className="sidebar-section-header">
          <span>Collections</span>
          <button
            className="btn btn-link btn-sm p-0"
            onClick={() => setIsAdding(true)}
            title="Add Collection"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>

        {/* Add Collection Form */}
        {isAdding && (
          <div className="sidebar-add-form">
            <div className="d-flex gap-2 mb-2">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle emoji-picker-btn"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {newEmoji}
                </button>
                <ul className="dropdown-menu emoji-dropdown">
                  {emojis.map(emoji => (
                    <li key={emoji}>
                      <button
                        className="dropdown-item emoji-option"
                        onClick={() => setNewEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Collection name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                autoFocus
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm flex-fill" onClick={handleAdd}>
                Add
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => { setIsAdding(false); setNewName(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Collections List */}
        <div className="collections-list">
          {collections.map(collection => (
            <div
              key={collection.id}
              draggable
              onDragStart={(e) => handleDragStart(e, collection.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, collection.id)}
              className={`sidebar-item-wrapper ${draggedId === collection.id ? 'dragging' : ''}`}
            >
              {editingId === collection.id ? (
                <div className="sidebar-edit-form">
                  <div className="d-flex gap-2 mb-2">
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle emoji-picker-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        {editEmoji}
                      </button>
                      <ul className="dropdown-menu emoji-dropdown">
                        {emojis.map(emoji => (
                          <li key={emoji}>
                            <button
                              className="dropdown-item emoji-option"
                              onClick={() => setEditEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit(collection.id)}
                      autoFocus
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() => handleEdit(collection.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`sidebar-item ${selectedCollectionId === collection.id ? 'active' : ''}`}
                  onClick={() => onSelectCollection(collection.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCollection(collection.id)}
                >
                  <span className="sidebar-item-emoji">{collection.emoji}</span>
                  <span className="sidebar-item-text">{collection.name}</span>
                  <div className="sidebar-item-actions">
                    <button
                      className="btn btn-link btn-sm p-0"
                      onClick={(e) => { e.stopPropagation(); startEdit(collection); }}
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-link btn-sm p-0 text-danger"
                      onClick={(e) => { e.stopPropagation(); handleDelete(collection.id); }}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
