import { Component, computed, forwardRef, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ApiExcerptToken } from '@ngrx-io/shared';
import { SymbolLinkComponent } from './symbol-link.component';
import { CodeHighlightPipe } from './code-highlight.pipe';

@Component({
  selector: 'ngrx-symbol-excerpt',
  standalone: true,
  imports: [NgClass, forwardRef(() => SymbolLinkComponent), CodeHighlightPipe],
  /**
   * The transparent links are laid over the highlighted code, so both must
   * render the exact same characters. Content tokens are wrapped in an
   * ng-container to prevent the template's whitespace from being rendered.
   */
  template: `
    <div class="links">
      @for (excerpt of simplifiedExcerptTokens(); track $index) {
        @if (excerpt.kind === 'Content') {
          <ng-container>{{ excerpt.text }}</ng-container>
        } @else if (excerpt.kind === 'Reference') {
          <ngrx-symbol-link [reference]="excerpt.canonicalReference" />
        }
      }
    </div>
    <div
      class="code"
      [ngClass]="{ deprecated: deprecated() }"
      [innerHTML]="joinedContent() | ngrxCodeHighlight"
    ></div>
  `,
  styles: [
    `
      :host {
        position: relative;
        display: block;
        padding: 8px;
        overflow-x: auto;
      }

      ngrx-symbol-excerpt-group > :host {
        padding: 0;
        overflow-x: initial;
      }

      .links,
      .code {
        font-family: 'Space Mono', monospace;
        font-variant-ligatures: none;
        font-size: 12px;
      }

      .links {
        position: absolute;
        top: 8px;
        left: 8px;
        color: transparent;
        white-space: pre;
      }

      ngrx-symbol-excerpt-group > :host .links {
        top: 0;
        left: 0;
      }

      /* Reset the global pre styles for the pre rendered by the highlighter */
      .code ::ng-deep pre {
        margin: 0;
        overflow-x: initial;
        border: none;
      }

      .deprecated {
        text-decoration: line-through;
        font-style: italic;
        opacity: 0.72;
      }
    `,
  ],
})
export class SymbolExcerptComponent {
  excerptTokens = input.required<ApiExcerptToken[]>();
  deprecated = input<boolean>(false);
  simplifiedExcerptTokens = computed(() => {
    return this.excerptTokens().map((token, index) => {
      if (index !== 0) return token;

      return {
        ...token,
        text: token.text
          .replace('export declare ', '')
          .replace('export type', 'type')
          .replace('export interface', 'interface'),
      };
    });
  });
  joinedContent = computed(() => {
    return this.simplifiedExcerptTokens()
      .map((token) => token.text)
      .join('');
  });
}
