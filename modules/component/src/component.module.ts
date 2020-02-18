import { NgModule } from '@angular/core';
import { LetDirective } from './let';
import { PushPipe } from './push';

export const DECLARATIONS = [LetDirective, PushPipe];
export const EXPORTS = [DECLARATIONS];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [],
  exports: [EXPORTS],
})
export class NgRxComponentModule {}
