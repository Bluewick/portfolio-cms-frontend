import Prism from 'prismjs';

// Import essential language components for software engineering articles
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';

/**
 * Invokes Prism highlighting across all <pre><code> blocks in the DOM.
 */
export function highlightAll() {
  if (typeof window !== 'undefined') {
    Prism.highlightAll();
  }
}

/**
 * Highlights a specific DOM node.
 * @param {HTMLElement} element - Code block DOM node
 */
export function highlightElement(element) {
  if (element && typeof window !== 'undefined') {
    Prism.highlightElement(element);
  }
}

export default Prism;