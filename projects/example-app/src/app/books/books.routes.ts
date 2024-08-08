import { Routes } from '@angular/router';

import {
  CollectionPageComponent,
  FindBookPageComponent,
  ViewBookPageComponent,
} from '@example-app/books/containers';
import { bookExistsGuard } from '@example-app/books/guards';
import { provideState } from '@ngrx/store';
import * as fromBooks from '@example-app/books/reducers';
import { provideEffects } from '@ngrx/effects';
import { BookEffects, CollectionEffects } from './effects';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      /**
       * provideState() is used for composing state
       * from feature modules. These modules can be loaded
       * eagerly or lazily and will be dynamically added to
       * the existing state.
       */
      provideState(fromBooks.booksFeatureKey, fromBooks.reducers),
      /**
       * provideEffects() is used to register effects
       * from feature modules. Effects can be loaded
       * eagerly or lazily and will be started immediately.
       *
       * All Effects will only be instantiated once regardless of
       * whether they are registered once or multiple times.
       */
      provideEffects(BookEffects, CollectionEffects),
    ],
    children: [
      {
        path: 'find',
        component: FindBookPageComponent,
        data: { title: 'Find book' },
      },
      {
        path: ':id',
        component: ViewBookPageComponent,
        canActivate: [bookExistsGuard],
        data: { title: 'Book details' },
      },
      {
        path: '',
        component: CollectionPageComponent,
        data: { title: 'Collection' },
      },
    ],
  },
];
