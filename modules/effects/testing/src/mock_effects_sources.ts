import { Injectable } from '@angular/core';
import { EffectSources } from '@ngrx/effects';
import { Observable, EMPTY } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class MockEffectsSources extends EffectSources {
  addEffects() {
    // noop
  }

  toActions(): Observable<Action> {
    return EMPTY;
  }
}
