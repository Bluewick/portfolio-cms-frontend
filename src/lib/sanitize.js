import DOMPurify from 'dompurify';

/**
 * Configure DOMPurify transformation hooks
 */
if (typeof window !== 'undefined') {
  // Ensure external links are secure and open in a new tab
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
      node.classList.add(
        'text-slate-900',
        'underline',
        'underline-offset-4',
        'decoration-slate-400',
        'hover:decoration-slate-900',
        'transition-colors'
      );
    }

    // Ensure rendered images are responsive, rounded, and lazy-loaded
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.classList.add(
        'rounded-xl',
        'border',
        'border-slate-200',
        'max-w-full',
        'h-auto',
        'my-6',
        'shadow-sm'
      );
    }

    // Enhance table structures inside rich text
    if (node.tagName === 'TABLE') {
      node.classList.add(
        'w-full',
        'border-collapse',
        'text-left',
        'text-sm',
        'my-6',
        'border',
        'border-slate-200',
        'rounded-xl',
        'overflow-hidden'
      );
    }
  });
}

/**
 * Sanitizes an untrusted HTML string safely for dangerouslySetInnerHTML injection.
 * @param {string} dirtyHtml - HTML received from API/CMS
 * @param {object} options - Custom DOMPurify options
 * @returns {string} Sanitized, safe HTML string
 */
export function sanitizeHtml(dirtyHtml, options = {}) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'strike',
      'code', 'hr', 'br', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'pre', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'name', 'target', 'src', 'alt', 'title', 'class', 'id', 'rel',
      'loading', 'width', 'height', 'style'
    ],
    ALLOW_DATA_ATTR: false,
    ...options,
  });
}

/**
 * Strips all HTML tags to produce a clean plain-text string (useful for previews & meta excerpts).
 * @param {string} html - Raw HTML string
 * @returns {string} Plain text without HTML tags
 */
export function stripHtmlToText(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}