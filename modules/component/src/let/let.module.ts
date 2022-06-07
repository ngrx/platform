import { NgModule } from '@angular/core';
import { LetDirective } from './let.directive';

@NgModule({
  declarations: [LetDirective],
  exports: [LetDirective],
})
export class LetModule {}
