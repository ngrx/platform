import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { Injector, PLATFORM_ID } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { createCustomElement } from '@angular/elements';
import { AlertComponent } from './components/docs/alert.component';
import { CodeExampleComponent } from './components/docs/code-example.component';
import { MarkdownSymbolLinkComponent } from './components/docs/markdown-symbol-link.component';
import { StackblitzComponent } from './components/docs/stackblitz.component';
import { ExamplesService } from '@ngrx-io/app/examples/examples.service';
import { ReferenceService } from '@ngrx-io/app/reference/reference.service';

const waitForCustomElementRender = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const examplesServiceMock = {
  load: vi.fn(),
  open: vi.fn(),
};

const referenceServiceMock = {
  loadFromCanonicalReference: vi.fn(),
};

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
      imports: [AppComponent],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('docs custom elements', () => {
  beforeEach(() => {
    examplesServiceMock.load.mockClear();
    examplesServiceMock.open.mockClear();
    referenceServiceMock.loadFromCanonicalReference.mockClear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Overlay, useValue: {} },
        { provide: ExamplesService, useValue: examplesServiceMock },
        { provide: ReferenceService, useValue: referenceServiceMock },
      ],
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('passes signal inputs through @angular/elements for alert custom elements', async () => {
    const tagName = 'ngrx-test-alert-element';

    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        createCustomElement(AlertComponent, {
          injector: TestBed.inject(Injector),
        })
      );
    }

    const element = document.createElement(tagName);
    element.setAttribute('type', 'warn');
    document.body.appendChild(element);

    await waitForCustomElementRender();

    expect(element.classList.contains('warn')).toBe(true);
    expect(element.classList.contains('inform')).toBe(false);
  });

  it('passes signal inputs through @angular/elements for code example custom elements', async () => {
    const tagName = 'ngrx-test-code-example-element';
    const snippet = 'const answer = 42;';

    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        createCustomElement(CodeExampleComponent, {
          injector: TestBed.inject(Injector),
        })
      );
    }

    const element = document.createElement(tagName);
    element.setAttribute('snippet', snippet);
    document.body.appendChild(element);

    await waitForCustomElementRender();
    await waitForCustomElementRender();

    expect(element.textContent).toContain(snippet);
  });

  it('passes signal inputs through @angular/elements for markdown symbol link custom elements', async () => {
    const tagName = 'ngrx-test-markdown-symbol-link-element';
    const reference = '@angular/core!signal:function';

    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        createCustomElement(MarkdownSymbolLinkComponent, {
          injector: TestBed.inject(Injector),
        })
      );
    }

    const element = document.createElement(tagName);
    element.setAttribute('reference', reference);
    document.body.appendChild(element);

    await waitForCustomElementRender();

    const link = element.querySelector('a');

    expect(link?.textContent).toContain('signal');
    expect(link?.getAttribute('href')).toBe('https://angular.dev/api/core/signal');
  });

  it('passes signal inputs through @angular/elements for stackblitz custom elements', async () => {
    const tagName = 'ngrx-test-stackblitz-element';
    const exampleName = 'store-walkthrough';

    if (!customElements.get(tagName)) {
      customElements.define(
        tagName,
        createCustomElement(StackblitzComponent, {
          injector: TestBed.inject(Injector),
        })
      );
    }

    const element = document.createElement(tagName);
    element.setAttribute('name', exampleName);
    element.setAttribute('embedded', 'true');
    document.body.appendChild(element);

    await waitForCustomElementRender();
    await waitForCustomElementRender();

    expect(element.querySelector(`div[title="${exampleName}"]`)).not.toBeNull();
    expect(examplesServiceMock.load).toHaveBeenCalledTimes(1);
    expect(examplesServiceMock.load).toHaveBeenCalledWith(expect.any(HTMLDivElement), exampleName);
  });
});
