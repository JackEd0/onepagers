'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/lib/db';
import { extractVariables, renderTemplate, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';

interface QuickUseModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onCopied: (id: string) => void;
}

export default function QuickUseModal({ prompt, isOpen, onClose, onCopied }: QuickUseModalProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState('');

  const variables = prompt ? extractVariables(prompt.template) : [];

  // Initialize values when prompt changes
  useEffect(() => {
    if (prompt) {
      const initialValues: Record<string, string> = {};
      variables.forEach(v => {
        initialValues[v.name] = '';
      });
      setValues(initialValues);
    }
  }, [prompt?.id]);

  // Update preview
  useEffect(() => {
    if (prompt) {
      setPreview(renderTemplate(prompt.template, values));
    }
  }, [prompt, values]);

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(preview);
    if (success) {
      if (prompt) {
        onCopied(prompt.id);
      }
      showToast('Copied to clipboard!', 'success');
      onClose();
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  if (!isOpen || !prompt) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
        <div className="modal-content glass-modal">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-lightning-fill text-warning me-2"></i>
              Quick Use: {prompt.title}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Variable inputs */}
            <div className="mb-4">
              <h6 className="mb-3">Fill in the variables</h6>
              {variables.map(variable => (
                <div key={variable.name} className="mb-3">
                  <label className="form-label">
                    <code className="text-primary">{'{{'}{variable.name}{'}}'}</code>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={values[variable.name] || ''}
                    onChange={(e) => handleChange(variable.name, e.target.value)}
                    placeholder={`Enter ${variable.name}...`}
                    autoFocus={variables.indexOf(variable) === 0}
                  />
                </div>
              ))}
            </div>

            {/* Preview */}
            <div>
              <h6 className="mb-3">Preview</h6>
              <div className="preview-box">
                <pre className="mb-0">{preview}</pre>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCopy}>
              <i className="bi bi-clipboard me-1"></i>
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
