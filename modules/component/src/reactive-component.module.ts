import { NgModule } from '@angular/core';
import { LetModule } from './let/let.module';
import { PushModule } from './push/push.module';

/**
 * @deprecated `ReactiveComponentModule` is deprecated in favor of `LetModule` and `PushModule`.
 * See the {@link https://ngrx.io/guide/migration/v14#reactivecomponentmodule migration guide}
 * for more information.
 */
@NgModule({
  exports: [LetModule, PushModule],
})
export class ReactiveComponentModule {}
