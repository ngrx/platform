import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';

import { booksReducer } from './state/books.reducer';
import { collectionReducer } from './state/collection.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideStore({
      books: booksReducer,
      collection: collectionReducer,
    }),
  ],
};
