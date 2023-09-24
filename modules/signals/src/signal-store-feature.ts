import {
  EmptyFeatureResult,
  MergeFeatureResults,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';

export function signalStoreFeature<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): SignalStoreFeature<EmptyFeatureResult, F1>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): SignalStoreFeature<EmptyFeatureResult, MergeFeatureResults<[F1, F2]>>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>
): SignalStoreFeature<EmptyFeatureResult, MergeFeatureResults<[F1, F2, F3]>>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>
): SignalStoreFeature<
  EmptyFeatureResult,
  MergeFeatureResults<[F1, F2, F3, F4]>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>
): SignalStoreFeature<
  EmptyFeatureResult,
  MergeFeatureResults<[F1, F2, F3, F4, F5]>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<MergeFeatureResults<[F1, F2]>, F3>,
  f4: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3]>, F4>,
  f5: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4]>, F5>,
  f6: SignalStoreFeature<MergeFeatureResults<[F1, F2, F3, F4, F5]>, F6>
): SignalStoreFeature<
  EmptyFeatureResult,
  MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>
>;

export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>
): SignalStoreFeature<EmptyFeatureResult & Input, F1>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>,
  f2: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1]>,
    F2
  >
): SignalStoreFeature<
  EmptyFeatureResult & Input,
  MergeFeatureResults<[F1, F2]>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>,
  f2: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1]>,
    F2
  >,
  f3: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2]>,
    F3
  >
): SignalStoreFeature<
  EmptyFeatureResult & Input,
  MergeFeatureResults<[F1, F2, F3]>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult
>(
  Input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>,
  f2: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1]>,
    F2
  >,
  f3: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2]>,
    F3
  >,
  f4: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3]>,
    F4
  >
): SignalStoreFeature<
  EmptyFeatureResult & Input,
  MergeFeatureResults<[F1, F2, F3, F4]>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>,
  f2: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1]>,
    F2
  >,
  f3: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2]>,
    F3
  >,
  f4: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3]>,
    F4
  >,
  f5: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3, F4]>,
    F5
  >
): SignalStoreFeature<
  EmptyFeatureResult & Input,
  MergeFeatureResults<[F1, F2, F3, F4, F5]>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & Input, F1>,
  f2: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1]>,
    F2
  >,
  f3: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2]>,
    F3
  >,
  f4: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3]>,
    F4
  >,
  f5: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3, F4]>,
    F5
  >,
  f6: SignalStoreFeature<
    MergeFeatureResults<[EmptyFeatureResult & Input, F1, F2, F3, F4, F5]>,
    F6
  >
): SignalStoreFeature<
  EmptyFeatureResult & Input,
  MergeFeatureResults<[F1, F2, F3, F4, F5, F6]>
>;

export function signalStoreFeature(
  featureOrInput: SignalStoreFeature | Partial<SignalStoreFeatureResult>,
  ...restFeatures: SignalStoreFeature[]
): SignalStoreFeature {
  const features =
    typeof featureOrInput === 'function'
      ? [featureOrInput, ...restFeatures]
      : restFeatures;

  return (inputStore) =>
    features.reduce((store, feature) => feature(store), inputStore);
}

export function type<T>(): T {
  return undefined as T;
}
