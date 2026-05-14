import { HeadingElement, ContentElement } from '../types/markmap.types';
import log from '../utils/logger';

export class ContentParser {
  public extractHeadings(): HeadingElement[] {
    log.debug('Starting heading extraction');

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter((h) => this.isValidHeading(h as HTMLElement))
      .map((h) => this.createHeadingElement(h as HTMLElement))
      .filter((h) => h.text.length > 0);

    log.debug(`Found ${headings.length} valid headings`);
    return headings;
  }

  public extractContentElements(): ContentElement[] {
    log.debug('Starting content element extraction (headings + lists)');

    const container = this.getContentContainer();

    const elements: ContentElement[] = [];
    let currentHeadingLevel = 1;

    // Walk direct and nested children to capture headings and lists in DOM order
    const walk = (node: Element): void => {
      const tag = node.tagName?.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        const el = node as HTMLElement;
        if (this.isValidHeading(el)) {
          const text = this.cleanHeadingText(el.textContent || '');
          if (text.length > 0) {
            currentHeadingLevel = parseInt(tag.charAt(1));
            elements.push({ type: 'heading', level: currentHeadingLevel, text, element: el });
          }
        }
      } else if (tag === 'ul' || tag === 'ol') {
        const ordered = tag === 'ol';
        Array.from(node.querySelectorAll(':scope > li')).forEach((li) => {
          const { text, href } = this.extractListItemContent(li as HTMLElement);
          if (text.length > 0) {
            elements.push({
              type: 'list-item',
              level: currentHeadingLevel,
              text,
              href,
              ordered,
              element: li as HTMLElement
            });
          }
        });
      } else {
        // Recurse into generic containers (div, section, article, etc.)
        Array.from(node.children).forEach(walk);
      }
    };

    Array.from(container.children).forEach(walk);

    log.debug(`Extracted ${elements.length} content elements (headings + list items)`);
    return elements;
  }

  private getContentContainer(): Element | null {
    const selectors = [
      '.hb-docs-doc-content', '.hb-docs-content', '.docs-content',
      '.hb-landing-content', '.landing-content', '.page-content',
      '.content', 'main .container', 'main', 'article'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }

    // Fallback: find the lowest common ancestor of all page headings,
    // excluding nav/header/footer/sidebar elements
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).filter((h) => !h.closest('nav, header, footer, aside, .hb-docs-sidebar, .hb-docs-toc, .navbar'));

    if (headings.length === 0) return null;

    // Walk up from the first heading until we find an ancestor that contains all headings
    let ancestor: Element | null = headings[0].parentElement;
    while (ancestor && ancestor !== document.body) {
      if (headings.every((h) => ancestor!.contains(h))) {
        log.debug(`getContentContainer: using ancestor <${ancestor.tagName.toLowerCase()}> as fallback`);
        return ancestor;
      }
      ancestor = ancestor.parentElement;
    }

    // Last resort: body (will include the whole page — headings-only fallback is safer here)
    log.warn('getContentContainer: could not find a scoped container, list items may include navigation noise');
    return document.body;
  }

  private extractListItemContent(li: HTMLElement): { text: string; href?: string } {
    const anchor = li.querySelector('a');
    if (anchor) {
      return {
        text: this.cleanHeadingText(anchor.textContent || ''),
        href: anchor.getAttribute('href') || undefined
      };
    }
    return { text: this.cleanHeadingText(li.textContent || '') };
  }

  private isValidHeading(element: HTMLElement): boolean {
    const parent = element.closest('.hb-docs-sidebar, .hb-docs-toc, nav, .navbar, .breadcrumb');
    const textContent = element.textContent?.trim();
    return !parent && Boolean(textContent && textContent.length > 0);
  }

  private createHeadingElement(element: HTMLElement): HeadingElement {
    const text = this.cleanHeadingText(element.textContent || element.innerText || '');
    const level = parseInt(element.tagName.charAt(1));
    return { level, text, element };
  }

  private cleanHeadingText(text: string): string {
    text = text.replace(/[§¶#↵⌘∞†‡★☆♦♠♣♥←→↑↓]/g, '');
    text = text.replace(/[\u00A0-\u00FF\u2000-\u206F\u2E00-\u2E7F]/g, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  }

  public getPageTitle(): string {
    const fullTitle = document.title || 'Page Content';
    return fullTitle.split(' - ')[0] || fullTitle.split(' | ')[0] || fullTitle;
  }
}
