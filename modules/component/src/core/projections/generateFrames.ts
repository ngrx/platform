import { Observable, Subscriber } from 'rxjs';

export function generateFrames(
  asyncProducer: asyncProducerFn = window.requestAnimationFrame,
  asyncCanceler: asyncCancelerFn = window.cancelAnimationFrame,
  timestampProvider: TimestampProvider = Date
) {
  return asyncProducer || asyncCanceler
    ? generateFramesFactory(asyncProducer, asyncCanceler, timestampProvider)
    : DEFAULT_GENERATE_FRAMES_OPERATOR;
}

/**
 * Does the work of creating the observable for `animationFrames`.
 * @param timestampProvider The timestamp provider to use to create the observable
 */
function generateFramesFactory(
  asyncProducer: asyncProducerFn,
  asyncCanceler: asyncCancelerFn,
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

export type asyncProducerFn = (arg?: any) => any;
export type asyncCancelerFn = (arg?: any) => void;

export interface TimestampProvider {
  now(): number;
}
