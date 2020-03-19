import { NgModule } from '@angular/core';
import { LetDirective } from './let';
import { PushPipe } from './push';

const DECLARATIONS = [LetDirective, PushPipe];
const EXPORTS = [DECLARATIONS];

@NgModule({
  declarations: [DECLARATIONS],
  exports: [EXPORTS],
})
export class ReactiveComponentModule {}
