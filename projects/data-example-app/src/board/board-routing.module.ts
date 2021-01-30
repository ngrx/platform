import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardComponent } from './board.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BoardComponent,
      },
    ]),
  ],
})
export class BoardRoutingModule {}
