import { NgModule } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { EffectsRunner } from './runner';


export function _createActions(runner: EffectsRunner): Actions {
  return new Actions(runner);
}

@NgModule({
  providers: [
    EffectsRunner,
    { provide: Actions, deps: [ EffectsRunner ], useFactory: _createActions }
  ]
})
export class EffectsTestingModule { }
