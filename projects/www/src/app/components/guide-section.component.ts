import { Component, input, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith, tap } from 'rxjs';
import { GuideMenuLinkComponent } from './guide-link.component';
import { Section } from '../services/guide-menu.service';

@Component({
  selector: 'ngrx-guide-section',
  standalone: true,
  imports: [GuideMenuLinkComponent, MatIcon],
  template: `
    <section>
      @if (collapsible()) {
      <header>
        <button (click)="toggleSection()">
          <mat-icon>chevron_right</mat-icon>
          <span>{{ section().title }}</span>
        </button>
      </header>
      } @if (!collapsible() || isOpen()) {
      <div class="section-content">
        @for(child of section().children; track $index) { @if(child.kind ===
        'link') {
        <ngrx-guide-menu-link [url]="child.url">{{
          child.text
        }}</ngrx-guide-menu-link>
        } @else if(child.kind === 'break') {
        <hr />
        } @else {
        <ngrx-guide-section [section]="child"></ngrx-guide-section>
        } }
      </div>
      }
    </section>
  `,
  host: {
    '[class.open]': 'isOpen()',
    '[class.collapsible]': 'collapsible()',
    '[class.hasActiveUrl]': 'hasActiveUrl()',
  },
  styles: [
    `
      .section-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 3px;
      }

      :host(.collapsible) .section-content {
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        padding: 4px 16px;
        margin-left: 12px;
      }

      :host(.open) > section > header mat-icon {
        transform: rotate(90deg);
      }

      :host(.hasActiveUrl) > section > .section-content {
        border-color: rgba(207, 143, 197, 0.54);
      }

      section header button {
        font-family: 'Oxanium', sans-serif;
        font-weight: 600;
        margin: 6px 0 3px;
        font-size: 16px;
        display: flex;
        gap: 4px;
        align-items: center;
        padding: 0;
        outline: none;
        border: none;
        background: none;
        color: rgba(255, 255, 255, 0.72);
        cursor: pointer;
      }

      :host(.hasActiveUrl) > section > header > button {
        color: #cf8fc5;
      }

      section header mat-icon {
        opacity: 0.56;
        position: relative;
        top: -2px;
      }

      section :host {
        display: flex;
        flex-direction: column;
      }

      section :host header button {
        font-size: 14px;
      }

      hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        margin: 16px 0;
        width: 100%;
      }
    `,
  ],
})
export class GuideSectionComponent {
  router = inject(Router);
  location = inject(Location);
  section = input.required<Section>();
  collapsible = input<boolean>(true);
  isToggledOpen = signal(false);
  path = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this.isToggledOpen.set(false)),
      map(() => {
        return this.location.path(false);
      }),
      startWith(this.location.path(false))
    )
  );
  urls = computed(() => {
    const collectUrls = (section: Section): string[] => {
      const urls: string[] = [];
      for (const child of section.children) {
        if (child.kind === 'link') {
          urls.push(child.url);
        } else if (child.kind === 'section') {
          urls.push(...collectUrls(child));
        }
      }
      return urls;
    };

    return collectUrls(this.section());
  });
  hasActiveUrl = computed(() => {
    const path = this.path();

    if (!path) {
      return false;
    }

    return this.urls().some((url) => path === url);
  });
  isOpen = computed(() => this.isToggledOpen() || this.hasActiveUrl());

  toggleSection() {
    this.isToggledOpen.set(!this.isToggledOpen());
  }
}
