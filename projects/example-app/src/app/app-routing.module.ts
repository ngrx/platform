import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@example-app/auth/services';
import { NotFoundPageComponent } from '@example-app/core/containers';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  {
    path: 'books',
    loadChildren: () =>
      import('@example-app/books/books.module').then((m) => m.BooksModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    data: { title: 'Not found' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
