import { Injectable } from '@angular/core';
import { EffectsRunner } from '@ngrx/effects';

@Injectable()
export class MockEffectsRunner extends EffectsRunner {
  start() {
    // noop
  }
}
