'use client';

import { useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search prompts...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'p')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        onChange('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <div className="search-bar-container">
      <div className="position-relative">
        <i className="bi bi-search search-icon"></i>
        <input
          ref={inputRef}
          type="text"
          className="form-control form-control-lg search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="search-shortcut">
          <kbd>⌘K</kbd>
        </div>
      </div>
    </div>
  );
}
