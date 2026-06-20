import { beforeEach, expect } from 'vitest';
import { Observable } from 'rxjs';
import { TestScheduler, type TestMessage } from 'rxjs/testing';

type MarbleObservable<T> = Observable<T> & { messages: TestMessage[] };

let scheduler: TestScheduler;

beforeEach(() => {
  scheduler = new TestScheduler(() => undefined);
});

export function cold<T = unknown>(
  marbles: string,
  values?: Record<string, T>,
  error?: unknown
): Observable<T> {
  return scheduler.createColdObservable(marbles, values, error);
}

export function hot<T = unknown>(
  marbles: string,
  values?: Record<string, T>,
  error?: unknown
): Observable<T> {
  return scheduler.createHotObservable(marbles, values, error);
}

expect.extend({
  toBeObservable<T>(received: Observable<T>, expected: MarbleObservable<T>) {
    const actual: TestMessage[] = [];

    scheduler.schedule(() => {
      received.subscribe({
        next: (value) => {
          actual.push({
            frame: scheduler.frame,
            notification: { kind: 'N', value },
          });
        },
        error: (error) => {
          actual.push({
            frame: scheduler.frame,
            notification: { kind: 'E', error },
          });
        },
        complete: () => {
          actual.push({
            frame: scheduler.frame,
            notification: { kind: 'C' },
          });
        },
      });
    });

    scheduler.flush();

    try {
      expect(actual).toEqual(expected.messages);
      return {
        pass: true,
        message: () => 'expected observable not to match marble diagram',
      };
    } catch (error) {
      return {
        pass: false,
        message: () =>
          error instanceof Error
            ? error.message
            : 'expected observable to match marble diagram',
      };
    }
  },
});

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toBeObservable(expected: MarbleObservable<T>): T;
  }
}
