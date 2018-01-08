import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LiftedState } from './instrumented_reducer';

export class StoreState extends ReplaySubject<LiftedState> {
  currentState: LiftedState | undefined = undefined;

  constructor() {
    super(1);
  }

  setNextState(state: LiftedState) {
    this.currentState = state;
    this.next(state);
  }

  getCurrentState(): LiftedState | undefined {
    return this.currentState;
  }
}
