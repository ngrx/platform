import { NgModule } from '@angular/core';
import { PushPipe } from './push.pipe';

/**
 * @deprecated This module is deprecated in favor of the standalone PushPipe.
 */
@NgModule({
  imports: [PushPipe],
  exports: [PushPipe],
})
export class PushModule {}
