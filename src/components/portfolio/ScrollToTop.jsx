import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles smooth scrolling to top on route change or to hash anchor targets
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Remove '#' and find target element
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        // Subtle delay to ensure DOM has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}