import { createMarkmap } from './core/agsMarkmap';
import log from './utils/logger';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  log.debug('DOM ready, checking for markmap containers');

  // Check shortcode path first: if data was injected, use shortcode container
  const dataWindow = window as any;
  if (dataWindow.__agsMarkmapData) {
    log.debug('Shortcode data found, rendering from YAML');

    // Hide the auto-detect placeholder container (created by head-end hook)
    const autoContainer = document.getElementById('ags-markmap-container');
    if (autoContainer) {
      autoContainer.style.display = 'none';
      log.debug('Hidden auto-detect container (shortcode is active)');
    }

    const shortcodeContainer = document.getElementById('ags-markmap-shortcode-container');
    if (!shortcodeContainer) {
      log.warn('Shortcode data present but container #ags-markmap-shortcode-container not found');
      return;
    }

    log.separator('Starting AGS Markmap initialization (shortcode)');

    const markmap = createMarkmap('ags-markmap-shortcode-container');
    markmap
      .initialize()
      .then(() => {
        log.debug('AGS Markmap (shortcode) ready');
        if (dataWindow.HUGO_ENVIRONMENT === 'development') {
          dataWindow.agsMarkmap = markmap;
        }
      })
      .catch((error) => {
        log.error('Failed to initialize AGS Markmap (shortcode)', error);
      });
    return;
  }

  // Auto-detect path: check for head-end created container
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
