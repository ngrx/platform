import {
  Component,
  Injector,
  PLATFORM_ID,
  inject,
  signal,
  effect,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MenuComponent } from './components/menu.component';
import { MarkdownSymbolLinkComponent } from './components/docs/markdown-symbol-link.component';
import { AlertComponent } from './components/docs/alert.component';
import { CodeExampleComponent } from './components/docs/code-example.component';
import { CodeTabsComponent } from './components/docs/code-tabs.component';
import { StackblitzComponent } from './components/docs/stackblitz.component';
import { InstallInstructionsComponent } from './components/docs/install-instructions.component';
import { FooterComponent } from './components/footer.component';
import {
  TOP_BANNER_DISMISSED_STORAGE_KEY,
  TopBannerComponent,
} from './components/top-banner.component';

@Component({
  selector: 'ngrx-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    TopBannerComponent,
    MarkdownSymbolLinkComponent,
    AlertComponent,
    CodeExampleComponent,
    StackblitzComponent,
    InstallInstructionsComponent,
    FooterComponent,
  ],
  template: `
    @if (isTopBannerVisible()) {
      <ngrx-top-banner (dismiss)="isTopBannerVisible.set(false)" />
    }
    <ngrx-menu />
    <div class="content">
      <router-outlet />
      <ngrx-footer />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      :host.top-banner-visible {
        --top-banner-height: 44px;

        @media only screen and (max-width: 1280px) {
          --top-banner-height: 70px;
        }
      }

      ngrx-menu {
        position: fixed;
        left: 0;
        top: 0;
      }

      .content {
        position: relative;
        width: calc(100% - 270px);
        left: 270px;

        @media only screen and (max-width: 1280px) {
          width: 100%;
          left: 0;
          padding-top: var(--top-banner-height, 0px);
        }
      }
    `,
  ],
  host: {
    '[class.top-banner-visible]': 'isTopBannerVisible()',
  },
})
export class AppComponent {
  readonly #injector = inject(Injector);
  readonly #platformId = inject(PLATFORM_ID);

  readonly isTopBannerVisible = signal(false);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      this.initTopBanner();
      this.installCustomElements();
    }
  }

  initTopBanner(): void {
    if (localStorage.getItem(TOP_BANNER_DISMISSED_STORAGE_KEY) !== 'true') {
      this.isTopBannerVisible.set(true);
    }

    effect(() => {
      localStorage.setItem(
        TOP_BANNER_DISMISSED_STORAGE_KEY,
        `${!this.isTopBannerVisible()}`
      );
    });
  }

  async installCustomElements(): Promise<void> {
    const { createCustomElement } = await import('@angular/elements');

    const symbolLinkElement = createCustomElement(MarkdownSymbolLinkComponent, {
      injector: this.#injector,
    });
    customElements.define('ngrx-docs-symbol-link', symbolLinkElement);

    const alertElement = createCustomElement(AlertComponent, {
      injector: this.#injector,
    });
    customElements.define('ngrx-docs-alert', alertElement);

    const codeExampleElement = createCustomElement(CodeExampleComponent, {
      injector: this.#injector,
    });
    customElements.define('ngrx-code-example', codeExampleElement);

    const codeTabsElement = createCustomElement(CodeTabsComponent, {
      injector: this.#injector,
    });
    customElements.define('ngrx-code-tabs', codeTabsElement);

    const stackblitzElement = createCustomElement(StackblitzComponent, {
      injector: this.#injector,
    });
    customElements.define('ngrx-docs-stackblitz', stackblitzElement);

    const installInstructionsElement = createCustomElement(
      InstallInstructionsComponent,
      { injector: this.#injector }
    );
    customElements.define('ngrx-docs-install', installInstructionsElement);
  }
}
