import { createMarkmap } from './core/agsMarkmap';
import log from './utils/logger';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  log.debug('DOM ready, checking for markmap containers');

  // Check if markmap container exists (indicating markmap is enabled)
  const container = document.getElementById('ags-markmap-container');
  if (!container) {
    log.debug('No markmap container found, skipping initialization');
    return;
  }

  log.separator('Starting AGS Markmap initialization');

  // Create and initialize markmap instance
  const markmap = createMarkmap();

  markmap
    .initialize()
    .then(() => {
      log.debug('AGS Markmap ready for use');

      // Make instance available globally for debugging in development
      if ((window as any).HUGO_ENVIRONMENT === 'development') {
        (window as any).agsMarkmap = markmap;
        log.debug('AGS Markmap instance available at window.agsMarkmap');
      }
    })
    .catch((error) => {
      log.error('Failed to initialize AGS Markmap', error);
    });
});
