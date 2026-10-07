import DOMPurify from 'dompurify';

/**
 * Configure DOMPurify transformation hooks
 */
if (typeof window !== 'undefined') {
  // Prevent duplicate hooks during React Fast Refresh / Vite HMR
  DOMPurify.removeHook('afterSanitizeAttributes');

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Ensure external links are secure and open in a new tab
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
      node.classList.add(
        'text-[#C2410C]',
        'underline',
        'underline-offset-4',
        'decoration-[#C2410C]/40',
        'hover:decoration-[#C2410C]',
        'transition-colors'
      );
    }

    // Ensure rendered images are responsive, rounded, and lazy-loaded
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.classList.add(
        'rounded-2xl',
        'border',
        'border-[#E7E2DA]',
        'max-w-full',
        'h-auto',
        'my-8',
        'shadow-xs'
      );
    }
  });
}

/**
 * Sanitizes an untrusted HTML string safely for blog rendering.
 * @param {string} dirtyHtml - HTML received from API/CMS
 * @param {object} options - Custom DOMPurify options
 * @returns {string} Sanitized, safe HTML string
 */
export function sanitizeHtml(dirtyHtml, options = {}) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirtyHtml, {
    // Complete HTML5 semantic blog tags
    ALLOWED_TAGS: [
      // Semantic layout wrappers (Fixes stripped <article>, <header>, <section>)
      'article', 'section', 'header', 'footer', 'main', 'aside', 'nav',
      // Headings & Text
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'p', 'b', 'i', 'strong', 'em', 'strike', 's', 'u', 'mark', 'sub', 'sup',
      // Code & Technical content
      'code', 'pre', 'kbd', 'samp', 'var',
      // Breaks & Dividers
      'hr', 'br', 'div', 'span',
      // Lists
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      // Quotes & Figures
      'blockquote', 'q', 'cite', 'figure', 'figcaption',
      // Media & Links
      'a', 'img',
      // Tables & Grid structures
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'col', 'colgroup',
      // Collapsible details (optional)
      'details', 'summary'
    ],
    ALLOWED_ATTR: [
      'href', 'name', 'target', 'src', 'alt', 'title', 'class', 'id', 'rel',
      'loading', 'width', 'height', 'style',
      // Crucial table attributes
      'colspan', 'rowspan', 'scope',
      // Accessibility
      'aria-label', 'aria-hidden', 'role'
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