import { getTestScheduler } from 'jasmine-marbles';
import { Notification } from 'rxjs/Notification';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TestMessage } from 'rxjs/testing/TestMessage';
import { TestScheduler } from 'rxjs/testing/TestScheduler';

declare global {
  namespace jasmine {
    interface Matchers {
      toEqualObservable: any;
    }
  }
}

/*
* Based on source code found in rxjs library
* https://github.com/ReactiveX/rxjs/blob/master/src/testing/TestScheduler.ts
*
*/
function materializeInnerObservable(
  observable: Observable<any>,
  outerFrame: number
): TestMessage[] {
  const messages: TestMessage[] = [];
  const scheduler = getTestScheduler();

  observable.subscribe(
    value => {
      messages.push({
        frame: scheduler.frame - outerFrame,
        notification: Notification.createNext(value),
      });
    },
    err => {
      messages.push({
        frame: scheduler.frame - outerFrame,
        notification: Notification.createError(err),
      });
    },
    () => {
      messages.push({
        frame: scheduler.frame - outerFrame,
        notification: Notification.createComplete(),
      });
    }
  );
  return messages;
}

jasmine.getEnv().beforeAll(() =>
  jasmine.addMatchers({
    /*
    * Performs toEqual as an alternative to toBeObservable.
    * Based on source code found in rxjs library
    * https://github.com/ReactiveX/rxjs/blob/master/src/testing/TestScheduler.ts
    *
    * Provides a more detailed error response on why an observable
    * doesn't match
    *
    * Usage => expect(effect$).toEqualObservable(coldObservable);
    *
    */
    toEqualObservable: () => ({
      compare: function(actual: any, { fixture }: any) {
        const results: TestMessage[] = [];
        let subscription: Subscription;
        const scheduler = getTestScheduler();

        if (!scheduler) {
          throw new Error('TestScheduler must be initialised');
        }

        scheduler.schedule(() => {
          subscription = actual.subscribe(
            (x: any) => {
              let value = x;
              // Support Observable-of-Observables
              if (x instanceof Observable) {
                value = materializeInnerObservable(value, scheduler.frame);
              }
              results.push({
                frame: scheduler.frame,
                notification: Notification.createNext(value),
              });
            },
            (err: any) => {
              results.push({
                frame: scheduler.frame,
                notification: Notification.createError(err),
              });
            },
            () => {
              results.push({
                frame: scheduler.frame,
                notification: Notification.createComplete(),
              });
            }
          );
        });
        scheduler.flush();

        expect(results).toEqual(
          TestScheduler.parseMarbles(
            fixture.marbles,
            fixture.values,
            fixture.errorValue || fixture.error,
            true
          )
        );

        return { pass: true };
      },
    }),
  })
);
