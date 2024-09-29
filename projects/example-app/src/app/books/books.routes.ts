import { Routes } from '@angular/router';

import {
  CollectionPageComponent,
  FindBookPageComponent,
  ViewBookPageComponent,
} from '@example-app/books/containers';
import { bookExistsGuard } from '@example-app/books/guards';
import { provideBooks } from '@example-app/books/reducers';

export default [
  {
    path: '',
    providers: [provideBooks()],
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
] satisfies Routes;
