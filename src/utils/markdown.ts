/**
 * Utility functions for markdown processing
 */

/**
 * Convert markdown text to plain text by removing formatting
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) {
    return '';
  }

  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    // Replace line breaks with spaces for inline display
    .replace(/\n/g, ' ')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Truncate markdown text to a specified length while preserving words
 */
export function truncateMarkdown(markdown: string, maxLength: number = 100): string {
  const plainText = markdownToPlainText(markdown);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last space within the limit to avoid cutting words
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return `${truncated.substring(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}
