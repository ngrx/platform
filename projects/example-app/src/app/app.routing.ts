import { Routes } from '@angular/router';

import { authGuard } from '@example-app/auth/services';
import { NotFoundPageComponent } from '@example-app/core/containers';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadChildren: () => import('@example-app/auth/auth.routes'),
  },
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  {
    path: 'books',
    loadChildren: () => import('@example-app/books/books.routes'),
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Not found' },
  },
];
