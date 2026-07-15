import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { MarkdownArticleComponent } from './markdown-article.component';

@Component({
  standalone: true,
  imports: [MarkdownArticleComponent],
  template: `
    <ngrx-markdown-article>
      <h2 id="rules">Rules</h2>
      <p>
        <a id="fragment-link" href="#rules">rules</a>
        <a id="page-link" href="/guide/store">store guide</a>
      </p>
    </ngrx-markdown-article>
  `,
})
class TestHostComponent {}

describe('MarkdownArticleComponent', () => {
  let router: Router;

  beforeEach(() => {
    // jsdom implements neither scrollIntoView nor link navigation
    Element.prototype.scrollIntoView = vi.fn();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [TestHostComponent],
    });

    router = TestBed.inject(Router);
  });

  function clickLink(id: string, eventInit: MouseEventInit = {}) {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      `#${id}`
    ) as HTMLAnchorElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ...eventInit,
    });

    // capture whether the component prevented the default action and then
    // always prevent it, so jsdom does not attempt to navigate
    let defaultPrevented = false;
    document.addEventListener(
      'click',
      (bubbledEvent) => {
        defaultPrevented = bubbledEvent.defaultPrevented;
        bubbledEvent.preventDefault();
      },
      { once: true }
    );
    link.dispatchEvent(event);

    return { defaultPrevented };
  }

  it('navigates to the fragment when a fragment-only link is clicked', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const { defaultPrevented } = clickLink('fragment-link');

    expect(defaultPrevented).toBe(true);
    expect(navigate).toHaveBeenCalledWith([], { fragment: 'rules' });
  });

  it('does not intercept links to other pages', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const { defaultPrevented } = clickLink('page-link');

    expect(defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('does not intercept fragment link clicks with modifier keys', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const { defaultPrevented } = clickLink('fragment-link', { ctrlKey: true });

    expect(defaultPrevented).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
