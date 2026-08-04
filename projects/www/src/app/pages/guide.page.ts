import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MarkdownArticleComponent } from '../components/docs/markdown-article.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Location } from '@angular/common';
import { GuideMenuService } from '../services/guide-menu.service';
import { GuideFooterComponent } from '../components/guide-footer.component';

@Component({
  selector: 'ngrx-guide-page',
  imports: [RouterOutlet, MarkdownArticleComponent, GuideFooterComponent],
  template: `
    <ngrx-markdown-article>
      <router-outlet></router-outlet>
      <ngrx-guide-footer
        [previousLink]="previousLink()"
        [nextLink]="nextLink()"
      ></ngrx-guide-footer>
    </ngrx-markdown-article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export default class GuidePageComponent {
  router = inject(Router);
  guideMenuService = inject(GuideMenuService);
  location = inject(Location);
  path = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        return this.location.path(false);
      }),
      startWith(this.location.path(false))
    )
  );
  previousLink = computed(() => {
    const path = this.path();

    return path ? this.guideMenuService.getPreviousLink(path) : null;
  });
  nextLink = computed(() => {
    const path = this.path();

    return path ? this.guideMenuService.getNextLink(path) : null;
  });
}
