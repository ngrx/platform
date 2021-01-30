import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { BoardUiModule } from './ui/board-ui.module';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  imports: [CommonModule, BoardUiModule, BoardRoutingModule],
  declarations: [BoardComponent],
  exports: [BoardComponent],
})
export class BoardModule {}
