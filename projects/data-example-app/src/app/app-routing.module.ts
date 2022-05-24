import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('../board/board.module').then((m) => m.BoardModule),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
