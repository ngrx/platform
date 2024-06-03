import { Component, Injector, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MenuComponent } from './components/menu.component';
import { MarkdownSymbolLinkComponent } from './components/docs/markdown-symbol-link.component';
import { AlertComponent } from './components/docs/alert.component';
import { CodeExampleComponent } from './components/docs/code-example.component';
import { StackblitzComponent } from './components/docs/stackblitz.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'www-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent,
    MarkdownSymbolLinkComponent,
    AlertComponent,
    CodeExampleComponent,
    StackblitzComponent,
    FooterComponent,
  ],
  template: `
    <ngrx-menu></ngrx-menu>
    <router-outlet></router-outlet>
    <ngrx-footer></ngrx-footer>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: calc(100lvw - 270px);
        left: 270px;
      }

      ngrx-menu {
        position: fixed;
        top: 0;
        left: 0;
      }
    `,
  ],
})
export class AppComponent {
  injector = inject(Injector);
  platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.installCustomElements();
    }
  }

  async installCustomElements() {
    const { createCustomElement } = await import('@angular/elements');

    const symbolLinkElement = createCustomElement(MarkdownSymbolLinkComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-symbol-link', symbolLinkElement);

    const alertElement = createCustomElement(AlertComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-alert', alertElement);

    const codeExampleElement = createCustomElement(CodeExampleComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-code-example', codeExampleElement);

    const stackblitzElement = createCustomElement(StackblitzComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-stackblitz', stackblitzElement);
  }
}
