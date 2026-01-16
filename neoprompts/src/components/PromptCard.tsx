'use client';

import { Prompt } from '@/lib/db';
import { truncate, formatDate, copyToClipboard, hasVariables } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUse: (prompt: Prompt) => void;
  onCopy: (id: string) => void;
}

export default function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUse,
  onCopy,
}: PromptCardProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    if (hasVariables(prompt.template)) {
      onUse(prompt);
    } else {
      const success = await copyToClipboard(prompt.template);
      if (success) {
        onCopy(prompt.id);
        showToast('Copied to clipboard!', 'success');
      } else {
        showToast('Failed to copy', 'error');
      }
    }
  };

  return (
    <div className="prompt-card card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{prompt.title}</h5>
          <button
            className={`btn btn-link p-0 favorite-btn ${prompt.isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(prompt.id)}
            title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`bi ${prompt.isFavorite ? 'bi-star-fill' : 'bi-star'}`}></i>
          </button>
        </div>

        <p className="card-text text-muted prompt-preview flex-grow-1">
          {truncate(prompt.template, 150)}
        </p>

        {prompt.tags.length > 0 && (
          <div className="prompt-tags mb-3">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="badge bg-outline-secondary">+{prompt.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-muted">
            <i className="bi bi-files me-1"></i>
            {prompt.copyCount} copies
            {prompt.lastCopiedAt && (
              <span className="ms-2">· {formatDate(prompt.lastCopiedAt)}</span>
            )}
          </small>
          <div className="prompt-actions">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => onEdit(prompt)}
              title="Edit"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(prompt.id)}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCopy}
              title={hasVariables(prompt.template) ? 'Use with variables' : 'Copy'}
            >
              {hasVariables(prompt.template) ? (
                <><i className="bi bi-lightning me-1"></i>Use</>
              ) : (
                <><i className="bi bi-clipboard me-1"></i>Copy</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
