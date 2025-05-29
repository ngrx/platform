import {
  EmptyFeatureResult,
  SignalStoreFeature,
  SignalStoreFeatureResult,
} from './signal-store-models';
import { Prettify } from './ts-helpers';

type PrettifyFeatureResult<Result extends SignalStoreFeatureResult> = Prettify<{
  state: Prettify<Result['state']>;
  props: Prettify<Result['props']>;
  methods: Prettify<Result['methods']>;
}>;

export function signalStoreFeature<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>
): SignalStoreFeature<EmptyFeatureResult, F1>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>
): SignalStoreFeature<EmptyFeatureResult, PrettifyFeatureResult<F1 & F2>>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>
): SignalStoreFeature<EmptyFeatureResult, PrettifyFeatureResult<F1 & F2 & F3>>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4>
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
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5>
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
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9>
>;
export function signalStoreFeature<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
  F10 extends SignalStoreFeatureResult
>(
  f1: SignalStoreFeature<EmptyFeatureResult, F1>,
  f2: SignalStoreFeature<{} & F1, F2>,
  f3: SignalStoreFeature<F1 & F2, F3>,
  f4: SignalStoreFeature<F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>
): SignalStoreFeature<
  EmptyFeatureResult,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10>
>;

export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>
): SignalStoreFeature<Prettify<EmptyFeatureResult & Input>, F1>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult
>(
  Input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4>
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
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5>
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
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5, F6>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6, F7>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<
    NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8,
    F9
  >
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9>
>;
export function signalStoreFeature<
  Input extends Partial<SignalStoreFeatureResult>,
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
  F10 extends SignalStoreFeatureResult
>(
  input: Input,
  f1: SignalStoreFeature<EmptyFeatureResult & NoInfer<Input>, F1>,
  f2: SignalStoreFeature<NoInfer<Input> & F1, F2>,
  f3: SignalStoreFeature<NoInfer<Input> & F1 & F2, F3>,
  f4: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<
    NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8,
    F9
  >,
  f10: SignalStoreFeature<
    NoInfer<Input> & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9,
    F10
  >
): SignalStoreFeature<
  Prettify<EmptyFeatureResult & Input>,
  PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10>
>;

export function signalStoreFeature(
  ...args:
    | [Partial<SignalStoreFeatureResult>, ...SignalStoreFeature[]]
    | SignalStoreFeature[]
): SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult> {
  const features = (
    typeof args[0] === 'function' ? args : args.slice(1)
  ) as SignalStoreFeature[];

  return (inputStore) =>
    features.reduce((store, feature) => feature(store), inputStore);
}

export function type<T>(): T {
  return undefined as T;
}
