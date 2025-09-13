import {
  Component,
  Injector,
  PLATFORM_ID,
  inject,
  OnDestroy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MenuComponent } from './components/menu.component';
import { MarkdownSymbolLinkComponent } from './components/docs/markdown-symbol-link.component';
import { AlertComponent } from './components/docs/alert.component';
import { CodeExampleComponent } from './components/docs/code-example.component';
import { CodeTabsComponent } from './components/docs/code-tabs.component';
import { StackblitzComponent } from './components/docs/stackblitz.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'ngrx-root',
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
        width: calc(100% - 270px);
        left: 270px;
        @media only screen and (max-width: 1280px) {
          width: 100%;
          left: 0;
        }
      }

      ngrx-menu {
        position: fixed;
        top: 0;
        left: 0;
      }
    `,
  ],
})
export class AppComponent implements OnDestroy {
  private isAlive = true;
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.installCustomElements();
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }

  async installCustomElements() {
    if (!this.isAlive) return;

    const { createCustomElement } = await import('@angular/elements');

    if (!this.isAlive) return;

    const symbolLinkElement = createCustomElement(MarkdownSymbolLinkComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-symbol-link', symbolLinkElement);

    if (!this.isAlive) return;

    const alertElement = createCustomElement(AlertComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-alert', alertElement);

    if (!this.isAlive) return;

    const codeExampleElement = createCustomElement(CodeExampleComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-code-example', codeExampleElement);

    if (!this.isAlive) return;

    const codeTabsElement = createCustomElement(CodeTabsComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-code-tabs', codeTabsElement);

    if (!this.isAlive) return;

    const stackblitzElement = createCustomElement(StackblitzComponent, {
      injector: this.injector,
    });
    customElements.define('ngrx-docs-stackblitz', stackblitzElement);
  }
}
