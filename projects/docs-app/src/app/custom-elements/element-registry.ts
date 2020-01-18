import { InjectionToken, Type } from '@angular/core';
import { LoadChildrenCallback } from '@angular/router';
import { PlaceholderComponent } from 'app/pages/placeholder.component';

// Modules containing custom elements must be set up as lazy-loaded routes (loadChildren)
// TODO(andrewjs): This is a hack, Angular should have first-class support for preparing a module
// that contains custom elements.
export const ELEMENT_MODULE_PATHS_AS_ROUTES = [
  {
    path: 'aio-announcement-bar',
    component: PlaceholderComponent,
    selector: 'aio-announcement-bar',
    loadChildren: () =>
      import('./announcement-bar/announcement-bar.module').then(
        m => m.AnnouncementBarModule
      ),
  },
  {
    path: 'aio-api-list',
    component: PlaceholderComponent,
    selector: 'aio-api-list',
    loadChildren: () =>
      import('./api/api-list.module').then(m => m.ApiListModule),
  },
  {
    path: 'aio-contributor-list',
    component: PlaceholderComponent,
    selector: 'aio-contributor-list',
    loadChildren: () =>
      import('./contributor/contributor-list.module').then(
        m => m.ContributorListModule
      ),
  },
  {
    path: 'aio-event-list',
    component: PlaceholderComponent,
    selector: 'aio-event-list',
    loadChildren: () =>
      import('./events/event-list.module').then(m => m.EventListModule),
  },
  {
    path: 'aio-file-not-found-search',
    component: PlaceholderComponent,
    selector: 'aio-file-not-found-search',
    loadChildren: () =>
      import('./search/file-not-found-search.module').then(
        m => m.FileNotFoundSearchModule
      ),
  },
  {
    path: 'aio-resource-list',
    component: PlaceholderComponent,
    selector: 'aio-resource-list',
    loadChildren: () =>
      import('./resource/resource-list.module').then(m => m.ResourceListModule),
  },
  {
    path: 'aio-toc',
    component: PlaceholderComponent,
    selector: 'aio-toc',
    loadChildren: () => import('./toc/toc.module').then(m => m.TocModule),
  },
  {
    path: 'code-example',
    component: PlaceholderComponent,
    selector: 'code-example',
    loadChildren: () =>
      import('./code/code-example.module').then(m => m.CodeExampleModule),
  },
  {
    path: 'code-tabs',
    component: PlaceholderComponent,
    selector: 'code-tabs',
    loadChildren: () =>
      import('./code/code-tabs.module').then(m => m.CodeTabsModule),
  },
  {
    path: 'current-location',
    component: PlaceholderComponent,
    selector: 'current-location',
    loadChildren: () =>
      import('./current-location/current-location.module').then(
        m => m.CurrentLocationModule
      ),
  },
  {
    path: 'expandable-section',
    component: PlaceholderComponent,
    selector: 'expandable-section',
    loadChildren: () =>
      import('./expandable-section/expandable-section.module').then(
        m => m.ExpandableSectionModule
      ),
  },
  {
    path: 'live-example',
    component: PlaceholderComponent,
    selector: 'live-example',
    loadChildren: () =>
      import('./live-example/live-example.module').then(
        m => m.LiveExampleModule
      ),
  },
  {
    path: 'ngrx-circles',
    component: PlaceholderComponent,
    selector: 'ngrx-circles',
    loadChildren: () =>
      import('./ngrx/circles.module').then(m => m.CirclesModule),
  },
  {
    path: 'ngrx-code-block',
    component: PlaceholderComponent,
    selector: 'ngrx-code-block',
    loadChildren: () =>
      import('./ngrx/code-block.module').then(m => m.CodeBlockModule),
  },
  {
    path: 'ngrx-store-animation',
    component: PlaceholderComponent,
    selector: 'ngrx-store-animation',
    loadChildren: () =>
      import('./ngrx/store-animation.module').then(m => m.StoreAnimationModule),
  },
];

/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithCustomElementComponent {
  customElementComponent: Type<any>;
}

/** Injection token to provide the element path modules. */
export const ELEMENT_MODULE_PATHS_TOKEN = new InjectionToken(
  'aio/elements-map'
);

/** Map of possible custom element selectors to their lazy-loadable module paths. */
export const ELEMENT_MODULE_PATHS = new Map<string, LoadChildrenCallback>();
ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
  ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
});
