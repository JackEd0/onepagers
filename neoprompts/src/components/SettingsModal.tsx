'use client';

import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { exportData, importData, clearAllData } from '@/lib/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neoprompts-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const result = await importData(text);
      showToast(`Imported ${result.prompts} prompts, ${result.collections} collections, ${result.tags} tags`, 'success');
      onClose();
    } catch (error) {
      showToast('Failed to import data. Check the file format.', 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
      if (confirm('This will permanently delete all prompts, collections, and tags. Continue?')) {
        try {
          await clearAllData();
          showToast('All data cleared', 'success');
          onClose();
        } catch (error) {
          showToast('Failed to clear data', 'error');
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content glass-modal">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-gear me-2"></i>
              Settings
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Theme */}
            <div className="mb-4">
              <h6 className="mb-3">Appearance</h6>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTheme('light')}
                >
                  <i className="bi bi-sun me-1"></i>
                  Light
                </button>
                <button
                  type="button"
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTheme('dark')}
                >
                  <i className="bi bi-moon me-1"></i>
                  Dark
                </button>
                <button
                  type="button"
                  className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTheme('system')}
                >
                  <i className="bi bi-display me-1"></i>
                  System
                </button>
              </div>
            </div>

            {/* Data Management */}
            <div className="mb-4">
              <h6 className="mb-3">Data Management</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" onClick={handleExport}>
                  <i className="bi bi-download me-2"></i>
                  Export to JSON
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                >
                  <i className="bi bi-upload me-2"></i>
                  {isImporting ? 'Importing...' : 'Import from JSON'}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone">
              <h6 className="mb-3 text-danger">Danger Zone</h6>
              <button className="btn btn-outline-danger w-100" onClick={handleClearAll}>
                <i className="bi bi-trash me-2"></i>
                Clear All Data
              </button>
              <small className="text-muted d-block mt-2">
                This will permanently delete all prompts, collections, and tags.
              </small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
