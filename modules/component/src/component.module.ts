import { NgModule } from '@angular/core';
import { LetDirective } from './let/let.directive';
import { Async$Pipe } from './push$/async$.pipe';
import { Push$Pipe } from './push$/push$.pipe';

const DECLARATIONS = [LetDirective, Push$Pipe, Async$Pipe];

const EXPORTS = [DECLARATIONS];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [],
  exports: [EXPORTS],
})
export class NgRxComponentModule {}
