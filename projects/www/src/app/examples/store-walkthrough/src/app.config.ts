import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';

import { booksReducer } from './state/books.reducer';
import { collectionReducer } from './state/collection.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      books: booksReducer,
      collection: collectionReducer,
    }),
  ],
};
