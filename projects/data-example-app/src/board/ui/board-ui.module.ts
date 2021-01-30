import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardUiComponent } from './board-ui.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, DragDropModule, FormsModule],
  declarations: [BoardUiComponent],
  exports: [BoardUiComponent],
})
export class BoardUiModule {}
