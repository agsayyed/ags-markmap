import { HeadingElement } from '../types/markmap.types';
import log from '../utils/logger';

export class ContentParser {
  public extractHeadings(): HeadingElement[] {
    log.debug('Starting heading extraction');

    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    )
      .filter((h) => this.isValidHeading(h as HTMLElement))
      .map((h) => this.createHeadingElement(h as HTMLElement))
      .filter((h) => h.text.length > 0);

    log.debug(`Found ${headings.length} valid headings`);
    return headings;
  }

  private isValidHeading(element: HTMLElement): boolean {
    // Filter out navigation and system headings
    const parent = element.closest(
      '.hb-docs-sidebar, .hb-docs-toc, nav, .navbar, .breadcrumb'
    );
    const textContent = element.textContent?.trim();
    return !parent && Boolean(textContent && textContent.length > 0);
  }

  private createHeadingElement(element: HTMLElement): HeadingElement {
    const text = this.cleanHeadingText(
      element.textContent || element.innerText || ''
    );
    const level = parseInt(element.tagName.charAt(1));

    return {
      level,
      text,
      element,
    };
  }

  private cleanHeadingText(text: string): string {
    // Remove common anchor link symbols and decorations
    text = text.replace(/[§¶#↵⌘∞†‡★☆♦♠♣♥←→↑↓]/g, ''); // Various symbols
    text = text.replace(/[\u00A0-\u00FF\u2000-\u206F\u2E00-\u2E7F]/g, ' '); // Unicode symbols and spaces
    text = text.replace(/\s+/g, ' '); // Normalize whitespace
    return text.trim();
  }

  public getPageTitle(): string {
    // Extract clean page title (remove site branding)
    const fullTitle = document.title || 'Page Content';
    return fullTitle.split(' - ')[0] || fullTitle.split(' | ')[0] || fullTitle;
  }
}
