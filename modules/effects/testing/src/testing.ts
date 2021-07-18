import { FactoryProvider } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { defer, Observable } from 'rxjs';

export function provideMockActions(source: Observable<any>): FactoryProvider;
export function provideMockActions(
  factory: () => Observable<any>
): FactoryProvider;
/**
 * @description
 * Creates mock actions provider.
 *
 * @param factoryOrSource Actions' source or source creation function
 *
 * @usageNotes
 *
 * **With `TestBed.configureTestingModule`**
 *
 * ```ts
 * describe('Books Effects', () => {
 *   let actions$: Observable<any>;
 *   let effects: BooksEffects;
 *
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({
 *       providers: [
 *         provideMockActions(() => actions$),
 *         BooksEffects,
 *       ],
 *     });
 *
 *     actions$ = TestBed.inject(Actions);
 *     effects = TestBed.inject(BooksEffects);
 *   });
 * });
 * ```
 *
 * **With `Injector.create`**
 *
 * ```ts
 * describe('Counter Effects', () => {
 *   let injector: Injector;
 *   let actions$: Observable<any>;
 *   let effects: CounterEffects;
 *
 *   beforeEach(() => {
 *     injector = Injector.create({
 *       providers: [
 *         provideMockActions(() => actions$),
 *         CounterEffects,
 *       ],
 *     });
 *
 *     actions$ = injector.get(Actions);
 *     effects = injector.get(CounterEffects);
 *   });
 * });
 * ```
 */
export function provideMockActions(
  factoryOrSource: (() => Observable<any>) | Observable<any>
): FactoryProvider {
  return {
    provide: Actions,
    useFactory: (): Observable<any> => {
      if (typeof factoryOrSource === 'function') {
        return new Actions(defer(factoryOrSource));
      }

      return new Actions(factoryOrSource);
    },
    deps: [],
  };
}
