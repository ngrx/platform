import { WritableSignal } from '@angular/core';

export const STATE_SIGNAL = Symbol('STATE_SIGNAL');

export type StateSignal<State extends object> = {
  [STATE_SIGNAL]: WritableSignal<State>;
};
