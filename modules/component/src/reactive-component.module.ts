import { NgModule } from '@angular/core';
import { LetModule } from './let/let.module';
import { PushModule } from './push/push.module';

@NgModule({
  exports: [LetModule, PushModule],
})
export class ReactiveComponentModule {}
