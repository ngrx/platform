import { NgModule } from '@angular/core';
import { LetDirective } from './let.directive';

/**
 * @deprecated This module is deprecated in favor of the standalone LetDirective.
 */
@NgModule({
  imports: [LetDirective],
  exports: [LetDirective],
})
export class LetModule {}
