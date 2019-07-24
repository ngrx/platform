import { Injectable } from '@angular/core';
import { Hook$ } from '../hook$/hook$.decorator';
import { ConnectableObservable, merge, Observable, Subject } from 'rxjs';
import {
  endWith,
  map,
  mergeAll,
  publishReplay,
  scan,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalStateService {
  @Hook$('onDestroy') onDestroy$: any;

  private commandObservable$$ = new Subject<any>();
  private command$$ = new Subject<any>();
  state$: Observable<any> = merge(
    this.command$$,
    this.commandObservable$$.pipe(mergeAll())
  ).pipe(
    scan((s: any, c: any) => {
      const [keyToDelete, value]: [string, any] = (Object as any).entries(c)[0];
      const isKeyToDeletePresent = keyToDelete in s;
      // The key you want to delete is not stored :)
      if (!isKeyToDeletePresent && value === undefined) {
        return s;
      }
      // Delete slice
      if (value === undefined) {
        const { [keyToDelete]: v, ...newS } = s as any;
        return newS;
      }
      // update state
      return { ...s, ...c };
    }, {}),
    takeUntil(this.onDestroy$),
    publishReplay(1)
  );

  constructor() {
    // the local state service's `state$` observable should be hot on instantiation
    const subscription = (this.state$ as ConnectableObservable<any>).connect();
    this.onDestroy$.subscribe((_: any) => subscription.unsubscribe());
  }

  // This breaks the functional programming style for the user.
  // We should avoid such things. It's recommended passing streams like with `connectSlice();`
  /** @deprecated This is an invitation for imperative client code */
  setSlices(commands: any) {
    (Object as any)
      .entries(commands)
      .map(([key, value]: [any, any]) => ({ [key]: value }))
      .forEach((command: any) => this.command$$.next(command));
  }

  // This should be the way to go. Functional style should be broken by the user.
  // Not like with `this.setSlice`
  connectSlices(config: { [key: string]: Observable<any> }): void {
    // @TODO validation / typing params
    // @TODO consider multiple observables for the same key. Here I would suggest last one wins => switchAll
    (Object as any).entries(config).map(([slice, state$]: [any, any]) => {
      const slice$ = state$.pipe(
        map(state => ({ [slice]: state })),
        endWith({ [slice]: undefined })
      );
      this.commandObservable$$.next(slice$);
    });
  }
}
