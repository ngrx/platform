import {
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
} from './signal-store-models';
import { STATE_SOURCE, WritableStateSource } from './state-source';
import { Prettify } from './ts-helpers';
import { withFeature } from './with-feature';

type FeatureOutput<
  Input extends SignalStoreFeatureResult,
  Feature extends (data: any) => SignalStoreFeature
> = ReturnType<Feature> extends SignalStoreFeature<
  infer ResultInput,
  infer ResultOutput
>
  ? SignalStoreFeature<Input, ResultOutput>
  : never;

type FeatureFacotyWithOnelyOneParams<
  Feature extends (data: any) => SignalStoreFeature
> = Feature extends (data: infer Params) => SignalStoreFeature ? Params : never;

/**
 * @description
 *
 * Define a feature that depends on a specific part of the parent store.
 *
 * @usageNotes
 * ```ts
 * const withBooksFilter = withFeatureFactory((books: Signal<Book[]>) =>
 *   signalStoreFeature(
 *     withState({ query: '' }),
 *     withComputed((store) => ({
 *       filteredBooks: computed(() =>
 *         books().filter((b) => b.name.includes(store.query()))
 *       ),
 *     })),
 *     withMethods((store) => ({
 *       setQuery(query: string): void {
 *         patchState(store, { query });
 *       },
 *     }))
 *   )
 * );
 *
 * signalStore(
 *   withEntities<Book>(),
 *   withBooksFilter(({ entities }) => entities)
 * );
 * ```
 *
 * @param feature A feature factory function that accepts exactly one parameter.
 */
export function withFeatureFactory<
  Feature extends (data: any) => SignalStoreFeature
>(feature: Feature) {
  if (feature.length > 1) {
    throw new Error(
      `withFeatureFactory only supports functions with exactly one parameter. Got ${feature.length}.\n` +
        `If you need to pass multiple values, wrap them in a single object:\n\n` +
        `// ✅ Good:\n` +
        `withFeatureFactory(({ signalA, signalB }) => ...)\n\n` +
        `// ❌ Not allowed:\n` +
        `withFeatureFactory((signalA, signalB) => ...)`
    );
  }
  return <
    Input extends SignalStoreFeatureResult,
    Store extends Prettify<
      StateSignals<Input['state']> &
        Input['props'] &
        Input['methods'] &
        WritableStateSource<Input['state']>
    >
  >(
    entries: (store: Store) => FeatureFacotyWithOnelyOneParams<Feature>
  ) =>
    withFeature((store) => feature(entries(store as Store))) as FeatureOutput<
      Input,
      Feature
    >;
}
