import { computed, Signal, ValueEqualityFn } from '@angular/core';

type SelectSignalConfig<T> = { equal: ValueEqualityFn<T> };

type SignalValue<T> = T extends Signal<infer V> ? V : never;

export function selectSignal<Result>(
  projector: () => Result,
  config?: SelectSignalConfig<Result>
): Signal<Result>;
export function selectSignal<Signals extends Record<string, Signal<unknown>>>(
  signals: Signals,
  config?: SelectSignalConfig<{ [K in keyof Signals]: SignalValue<Signals[K]> }>
): Signal<{ [K in keyof Signals]: SignalValue<Signals[K]> }>;
export function selectSignal<Signals extends Signal<unknown>[], Result>(
  ...args: [
    ...signals: Signals,
    projector: (
      ...values: { [I in keyof Signals]: SignalValue<Signals[I]> }
    ) => Result
  ]
): Signal<Result>;
export function selectSignal<Signals extends Signal<unknown>[], Result>(
  ...args: [
    ...signals: Signals,
    projector: (
      ...values: { [I in keyof Signals]: SignalValue<Signals[I]> }
    ) => Result,
    config: SelectSignalConfig<Result>
  ]
): Signal<Result>;
export function selectSignal<Result>(
  ...selectSignalArgs: unknown[]
): Signal<Result> {
  const args = [...selectSignalArgs];

  const config: SelectSignalConfig<Result> =
    typeof args[args.length - 1] === 'object' && args.length > 1
      ? (args.pop() as SelectSignalConfig<Result>)
      : { equal: defaultEqual };

  if (typeof args[0] === 'object') {
    const signalsDictionary = args[0] as Record<string, Signal<unknown>>;
    const computation = () => {
      return Object.keys(signalsDictionary).reduce(
        (acc, key) => ({ ...acc, [key]: signalsDictionary[key]() }),
        {} as Result
      );
    };

    return computed(computation, config);
  }

  const projector = args.pop() as (...values: unknown[]) => Result;
  const signals = args as Signal<unknown>[];

  const computation =
    signals.length === 0
      ? projector
      : () => {
          const values = signals.map((signal) => signal());
          return projector(...values);
        };

  return computed(computation, config);
}

export function defaultEqual<T>(previous: T, current: T): boolean {
  return previous === current;
}
