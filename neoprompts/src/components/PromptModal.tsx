'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/db';
import { useCollections, useTags } from '@/lib/hooks';
import { randomTagColor } from '@/lib/utils';

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Prompt, 'id' | 'copyCount' | 'lastCopiedAt' | 'createdAt' | 'updatedAt'>) => void;
  defaultCollectionId?: string | null;
}

export default function PromptModal({
  prompt,
  isOpen,
  onClose,
  onSave,
  defaultCollectionId,
}: PromptModalProps) {
  const { collections } = useCollections();
  const { tags: allTags, addTag } = useTags();

  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('');
  const [description, setDescription] = useState('');
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (prompt) {
        setTitle(prompt.title);
        setTemplate(prompt.template);
        setDescription(prompt.description);
        setCollectionId(prompt.collectionId);
        setTags(prompt.tags);
        setIsFavorite(prompt.isFavorite);
      } else {
        setTitle('');
        setTemplate('');
        setDescription('');
        setCollectionId(defaultCollectionId ?? null);
        setTags([]);
        setIsFavorite(false);
      }
    }
  }, [isOpen, prompt, defaultCollectionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !template.trim()) return;

    onSave({
      title: title.trim(),
      template: template.trim(),
      description: description.trim(),
      collectionId,
      tags,
      isFavorite,
    });
    onClose();
  };

  const handleAddTag = async () => {
    const tagName = newTag.trim();
    if (!tagName) return;

    // Check if tag already exists
    const existing = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (!existing) {
      await addTag(tagName, randomTagColor());
    }

    if (!tags.includes(tagName)) {
      setTags([...tags, tagName]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleExistingTag = (tagName: string) => {
    if (tags.includes(tagName)) {
      setTags(tags.filter(t => t !== tagName));
    } else {
      setTags([...tags, tagName]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content glass-modal">
          <div className="modal-header">
            <h5 className="modal-title">{prompt ? 'Edit Prompt' : 'New Prompt'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter prompt title"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Template
                  <small className="text-muted ms-2">Use {'{{variable}}'} for placeholders</small>
                </label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="Enter your prompt template..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description (optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this prompt"
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Collection</label>
                  <select
                    className="form-select"
                    value={collectionId || ''}
                    onChange={(e) => setCollectionId(e.target.value || null)}
                  >
                    <option value="">No Collection</option>
                    {collections.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label d-flex align-items-center">
                    Favorite
                    <div className="form-check form-switch ms-auto mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isFavorite}
                        onChange={(e) => setIsFavorite(e.target.checked)}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Tags</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add new tag..."
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>

                {/* Selected tags */}
                {tags.length > 0 && (
                  <div className="selected-tags mb-2">
                    {tags.map(tag => (
                      <span key={tag} className="badge bg-primary me-1 mb-1">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: '0.6em' }}
                          onClick={() => removeTag(tag)}
                        ></button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Existing tags to select from */}
                {allTags.length > 0 && (
                  <div className="existing-tags">
                    <small className="text-muted">Existing tags:</small>
                    <div className="mt-1">
                      {allTags.filter(t => !tags.includes(t.name)).map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          className="badge bg-secondary me-1 mb-1 border-0"
                          onClick={() => toggleExistingTag(tag.name)}
                          style={{ cursor: 'pointer' }}
                        >
                          + {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {prompt ? 'Save Changes' : 'Create Prompt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
