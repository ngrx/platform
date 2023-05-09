import { ModuleWithProviders, NgModule } from '@angular/core';
import { StateObservable } from '@ngrx/store';
import { StoreDevtoolsOptions } from './config';
import { StoreDevtools } from './devtools';
import { provideStoreDevtools } from './provide-store-devtools';

export function createStateObservable(
  devtools: StoreDevtools
): StateObservable {
  return devtools.state;
}

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
