import { NgModule, Injector, Type, APP_BOOTSTRAP_LISTENER, OpaqueToken } from '@angular/core';
import { Actions } from './actions';
import { EffectsSubscription, effects } from './effects-subscription';
import { runAfterBootstrapEffects, afterBootstrapEffects } from './bootstrap-listener';
import { SingletonEffectsService } from './singleton-effects.service';


@NgModule({
  providers: [
    Actions,
    EffectsSubscription,
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      deps: [ Injector, EffectsSubscription ],
      useFactory: runAfterBootstrapEffects
    }
  ]
})
export class EffectsModule {
  static forRoot() {
    return {
      ngModule: EffectsModule,
      providers: [
        SingletonEffectsService
      ]
    };
  }

  static run(type: Type<any>) {
    return {
      ngModule: EffectsModule,
      providers: [
        EffectsSubscription,
        type,
        { provide: effects, useExisting: type, multi: true }
      ]
    };
  }

  static runAfterBootstrap(type: Type<any>) {
    return {
      ngModule: EffectsModule,
      providers: [
        type,
        { provide: afterBootstrapEffects, useExisting: type, multi: true }
      ]
    };
  }

  constructor(private effectsSubscription: EffectsSubscription) {}
}
