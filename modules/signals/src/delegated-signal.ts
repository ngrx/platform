import {
  computed,
  untracked,
  ValueEqualityFn,
  WritableSignal,
} from '@angular/core';

export type DelegatedSignalConfig<T> = {
  source: () => T;
  update: (value: NoInfer<T>) => void;
  equal?: ValueEqualityFn<NoInfer<T>>;
};

/**
 * @description
 *
 * Creates a `WritableSignal` whose reads are delegated to a source computation
 * and whose writes are delegated to an `update` callback.
 *
 * @usageNotes
 *
 * ```ts
 * import { Component, inject } from '@angular/core';
 * import {
 *   delegatedSignal,
 *   patchState,
 *   signalStore,
 *   withMethods,
 *   withState,
 * } from '@ngrx/signals';
 *
 * const CounterStore = signalStore(
 *   withState({ count: 0 }),
 *   withMethods((store) => ({
 *     updateCount(count: number): void {
 *       patchState(store, { count });
 *     },
 *   })),
 * );
 *
 * \@Component({
 *   selector: 'app-counter',
 *   template: '...',
 *   providers: [CounterStore],
 * })
 * class Counter {
 *   readonly #store = inject(CounterStore);
 *
 *   readonly count = delegatedSignal({
 *     source: this.#store.count,
 *     update: this.#store.updateCount,
 *   });
 * }
 * ```
 */
export function delegatedSignal<T>(
  config: DelegatedSignalConfig<T>
): WritableSignal<T> {
  const source = computed(config.source, { equal: config.equal });
  const delegated = computed(source) as WritableSignal<T>;

  delegated.set = (value) => config.update(value);
  delegated.update = (updater) => config.update(updater(untracked(source)));
  delegated.asReadonly = () => source;

  return delegated;
}
