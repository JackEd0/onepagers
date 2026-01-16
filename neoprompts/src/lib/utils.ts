// Variable parsing utilities

export interface VariableInfo {
  name: string;
  placeholder: string;
}

/**
 * Extract all {{variable}} placeholders from a template
 */
export function extractVariables(template: string): VariableInfo[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: VariableInfo[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(template)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        placeholder: match[0],
      });
    }
  }

  return variables;
}

/**
 * Check if a template has variables
 */
export function hasVariables(template: string): boolean {
  return /\{\{\w+\}\}/.test(template);
}

/**
 * Render a template with variable values
 */
export function renderTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [name, value] of Object.entries(values)) {
    const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | null): string {
  if (!date) return 'Never';
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a random color for tags
 */
export function randomTagColor(): string {
  const colors = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF3B30', // Red
    '#5856D6', // Purple
    '#AF52DE', // Magenta
    '#FF2D55', // Pink
    '#00C7BE', // Teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
