import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { NgModule, Component, Injectable } from '@angular/core';
import { platformDynamicServer } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { Store, StoreModule, combineReducers } from '../../../store';
import { EffectsModule, Effect, Actions } from '../../';

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
