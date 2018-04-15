import { Component, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { of } from 'rxjs';

import { Actions, Effect, EffectsModule } from '../../';
import { StoreModule } from '../../../store';

@Injectable()
export class NgcSpecFeatureEffects {
  constructor(actions$: Actions) {}

  @Effect() run$ = of({ type: 'NgcSpecFeatureAction' });
}

@NgModule({
  imports: [EffectsModule.forFeature([NgcSpecFeatureEffects])],
})
export class NgcSpecFeatureModule {}

@Injectable()
export class NgcSpecRootEffects {
  constructor(actions$: Actions) {}

  @Effect() run$ = of({ type: 'NgcSpecRootAction' });
}

export interface AppState {
  count: number;
}

@Component({
  selector: 'ngc-spec-component',
  template: `
    <h1>Hello Effects</h1>
  `,
})
export class NgcSpecComponent {}

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([NgcSpecRootEffects]),
    NgcSpecFeatureModule,
  ],
  declarations: [NgcSpecComponent],
  bootstrap: [NgcSpecComponent],
})
export class NgcSpecModule {}
