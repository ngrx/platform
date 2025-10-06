import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreDevtoolsOptions } from './config';
import { provideStoreDevtools } from './provide-store-devtools';

@NgModule({})
export class StoreDevtoolsModule {
  static instrument(
    options: StoreDevtoolsOptions = {}
  ): ModuleWithProviders<StoreDevtoolsModule> {
    return {
      ngModule: StoreDevtoolsModule,
      providers: [provideStoreDevtools(options)],
    };
  }
}
