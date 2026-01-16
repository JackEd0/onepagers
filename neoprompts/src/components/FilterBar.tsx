'use client';

import { useTags } from '@/lib/hooks';

interface FilterBarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortBy: 'createdAt' | 'lastCopiedAt' | 'copyCount' | 'title';
  onSortChange: (sort: 'createdAt' | 'lastCopiedAt' | 'copyCount' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function FilterBar({
  selectedTags,
  onTagsChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: FilterBarProps) {
  const { tags } = useTags();

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Last Created' },
    { value: 'lastCopiedAt', label: 'Last Copied' },
    { value: 'copyCount', label: 'Most Copied' },
    { value: 'title', label: 'Title A–Z' },
  ] as const;

  return (
    <div className="filter-bar">
      <div className="filter-bar-content">
        {/* Tags filter */}
        {tags.length > 0 && (
          <div className="filter-section">
            <span className="filter-label">Tags:</span>
            <div className="tag-filters">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`badge ${selectedTags.includes(tag.name) ? 'bg-primary' : 'bg-secondary'}`}
                  onClick={() => toggleTag(tag.name)}
                  style={{ cursor: 'pointer', border: 'none' }}
                >
                  {tag.name}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  className="btn btn-link btn-sm text-muted p-0 ms-2"
                  onClick={() => onTagsChange([])}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sort options */}
        <div className="filter-section ms-auto">
          <span className="filter-label">Sort:</span>
          <select
            className="form-select form-select-sm sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            className="btn btn-outline-secondary btn-sm sort-order-btn"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <i className={`bi bi-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
