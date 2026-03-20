import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { provideRouter } from '@angular/router';
import { Injector, PLATFORM_ID } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AlertComponent } from './components/docs/alert.component';

const waitForCustomElementRender = async () => {
  await Promise.resolve();
  await Promise.resolve();
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
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
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
});
