import {
  Component,
  ElementRef,
  OnDestroy,
  Signal,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

type Heading = { level: number; text: string; id: string; url: string };

@Component({
  selector: 'ngrx-markdown-article',
  standalone: true,
  template: `
    <article #article>
      <ng-content></ng-content>
    </article>
    <menu>
      @for (heading of headings(); track $index) {
      <a
        [href]="heading.url"
        [style]="{ paddingLeft: 24 + (heading.level - 2) * 8 + 'px' }"
        [class.active]="activeHeadingId() === heading.id"
        (click)="navigateToHeading($event, heading)"
      >
        {{ heading.text }}
      </a>
      }
    </menu>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        position: relative;
        padding-right: 240px;
      }

      menu {
        display: flex;
        width: 240px;
        flex-direction: column;
        gap: 6px;
        position: fixed;
        top: 24px;
        right: 24px;
        margin: 0;
        padding: 0;
        border-left: 1px solid rgba(255, 255, 255, 0.12);
      }

      menu a {
        color: rgba(255, 255, 255, 0.56);
        font-size: 13px;
        border-left: 2px solid transparent;
      }

      menu a:hover {
        color: rgba(255, 255, 255, 0.87);
      }

      menu a.active {
        color: rgba(255, 255, 255, 0.87);
        border-color: rgba(207, 143, 197, 0.96);
      }

      article {
        width: 960px;
        padding: 24px;
        margin: 0 auto;
      }

      article ::ng-deep h1 {
        font-size: 32px;
      }

      article ::ng-deep p:not(ngrx-alert p),
      article ::ng-deep li {
        opacity: 0.8;
      }

      article ::ng-deep code:not(pre code) {
        font-weight: 600;
      }

      article ::ng-deep table {
        border-collapse: collapse;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        margin: 14px 0;
      }

      article ::ng-deep table thead {
        background-color: rgba(0, 0, 0, 0.36);
        font-family: 'Oxanium', sans-serif;
      }

      article ::ng-deep table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      article ::ng-deep table th,
      article ::ng-deep table td {
        padding: 16px;
        text-align: left;
      }

      article ::ng-deep table td code {
        white-space: nowrap;
      }

      article ::ng-deep pre:has(code) {
        padding: 16px 20px;
      }
    `,
  ],
})
export class MarkdownArticleComponent implements OnDestroy {
  router = inject(Router);
  articleRef: Signal<ElementRef<HTMLElement>> = viewChild.required('article');
  headings = signal<Heading[]>([]);
  activeHeadingId = signal<string | null>(null);
  mutationObserver?: MutationObserver;
  intersectionObserver?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      this.mutationObserver = new MutationObserver(() =>
        this.collectHeadings()
      );
      this.mutationObserver.observe(this.articleRef().nativeElement, {
        childList: true,
        subtree: true,
      });

      this.collectHeadings();
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.disconnect();
  }

  navigateToHeading($event: MouseEvent, heading: Heading) {
    $event.preventDefault();

    this.router.navigate([], { fragment: heading.id }).then(() => {
      const element = document.getElementById(heading.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  private collectHeadings() {
    const headingElements = this.articleRef().nativeElement.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    );
    const headings: Heading[] = [];

    for (const heading of Array.from(headingElements)) {
      const textContent = heading.textContent ?? '';
      const id = textContent
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll(':', '')
        .replaceAll('@', '')
        .replaceAll('/', '-');
      heading.id = id;

      const currentUrl = this.router.url;
      const currentUrlWithoutHash = currentUrl.split('#')[0];
      const url = `${currentUrlWithoutHash}#${id}`;

      headings.push({
        level: parseInt(heading.tagName[1]),
        text: textContent,
        id,
        url,
      });
    }

    this.headings.set(headings);
    this.watchHeadings();
  }

  private watchHeadings() {
    console.log('watchHeadings');
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = undefined;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting
        );
        const firstHeadingIntersecting = this.headings().find((heading) =>
          intersectingEntries.some((e) => e.target.id === heading.id)
        );

        if (firstHeadingIntersecting) {
          this.activeHeadingId.set(firstHeadingIntersecting.id);
        }
      },
      { threshold: 1 }
    );

    const headingElements = this.articleRef().nativeElement.querySelectorAll(
      'h1, h2, h3, h4, h5, h6'
    );

    for (const heading of Array.from(headingElements)) {
      this.intersectionObserver.observe(heading);
    }
  }
}
