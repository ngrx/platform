import { Provider } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';

export function provideMockActions(source: Observable<any>): Provider;
export function provideMockActions(factory: () => Observable<any>): Provider;
export function provideMockActions(
  factoryOrSource: (() => Observable<any>) | Observable<any>
): Provider {
  return {
    provide: Actions,
    useFactory: (): Observable<any> => {
      if (typeof factoryOrSource === 'function') {
        return new Actions(defer(factoryOrSource));
      }

      return new Actions(factoryOrSource);
    },
  };
}
