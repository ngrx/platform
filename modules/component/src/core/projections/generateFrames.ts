import { Observable, Subscriber } from 'rxjs';

export interface AsyncProducerFn {
  (arg?: any): any;
}

export interface AsyncCancelerFn {
  (arg?: any): void;
}

export interface TimestampProvider {
  now(): number;
}

/**
 * @description
 * Observable creation functions helpful in environments with patched global APIs like zone.js environments where you can't use RxJSs `animationFrames`.
 * The projection function is similar to [`animationFrames`](https://rxjs.dev/api/index/function/animationFrames) of RxJS.
 *
 * @param {AsyncProducerFn} asyncProducer - The timestamp provider to use to create the observable
 * @param {AsyncCancelerFn} asyncCanceler - The timestamp provider to use to create the observable
 * @param {TimestampProvider} timestampProvider - The timestamp provider to use to create the observable
 * @return {Observable<number>} An Observable of numbers emitting every tick incremented.
 *
 * @usageNotes
 * This operator can be used to get the un-patched functions.
 *
 * ```ts
 * import {Observable} from 'rxjs';
 * import {generateFrames, AsyncProducerFn, AsyncCancelerFn} from '@ngrx/component';
 *
 * // Animation frame DOES NOT triggers zone
 * const asyncProducer: AsyncProducerFn = window['__zone_symbol__requestAnimationFrame'];
 * const asyncCanceler: AsyncCancelerFn = window['__zone_symbol__cancelAnimationFrame'];
 *
 * const afUnpatched$: Observable<number> =  generateFrames(asyncProducer,asyncCanceler);
 * ```
 */
export function generateFrames(
  asyncProducer: AsyncProducerFn = window.requestAnimationFrame,
  asyncCanceler: AsyncCancelerFn = window.cancelAnimationFrame,
  timestampProvider: TimestampProvider = Date
) {
  return asyncProducer || asyncCanceler
    ? generateFramesFactory(asyncProducer, asyncCanceler, timestampProvider)
    : DEFAULT_GENERATE_FRAMES_OPERATOR;
}

function generateFramesFactory(
  asyncProducer: AsyncProducerFn,
  asyncCanceler: AsyncCancelerFn,
  timestampProvider: TimestampProvider = Date
) {
  return new Observable<number>((subscriber: Subscriber<number>) => {
    let asyncCancelRef: number;
    const start = timestampProvider.now();
    const run = () => {
      subscriber.next(timestampProvider.now() - start);
      if (!subscriber.closed) {
        asyncCancelRef = asyncProducer(run);
      }
    };
    asyncCancelRef = asyncProducer(run);
    return () => {
      asyncCanceler(asyncCancelRef);
    };
  });
}

/**
 * In the common case, where `Date` is passed to `animationFrames` as the default,
 * we use this shared observable to reduce overhead.
 */
const DEFAULT_GENERATE_FRAMES_OPERATOR = generateFramesFactory(
  window.requestAnimationFrame,
  window.cancelAnimationFrame
);
