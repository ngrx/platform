import {
  SignalStoreConfig,
  SignalStoreFeatureResult,
  SignalStoreProps,
} from '../signal-store-models';
import { StateSignal } from '../state-signal';
import { Prettify } from '../ts-helpers';

export type EncapsulationConfig<Features extends SignalStoreFeatureResult> =
  SignalStoreConfig & {
    private?: Array<keyof SignalStoreProps<Features>>;
  } & (
      | {
          // don't allow to run `patchState` from the outside
          readonly?: boolean;
          readonlyExcept?: never;
        }
      | {
          readonly?: never;
          /**
           * don't allow to run `patchState` on the listed state properties
           */
          readonlyExcept?: Array<keyof SignalStoreProps<Features>>;
        }
    );

export type EncapsulatedStore<
  StoreFeatures extends SignalStoreFeatureResult,
  Config extends EncapsulationConfig<StoreFeatures>
> = Config['private'] extends Array<keyof SignalStoreProps<StoreFeatures>>
  ? Omit<
      SignalStoreProps<StoreFeatures>,
      keyof {
        [PropName in Config['private'][number]]: true;
      }
    >
  : SignalStoreProps<StoreFeatures>;

export type EncapsulatedState<
  StoreFeatures extends SignalStoreFeatureResult,
  Config extends EncapsulationConfig<StoreFeatures>
> = Config['readonly'] extends boolean
  ? StateSignal<never>
  : Config['readonlyExcept'] extends Array<keyof StoreFeatures['state']>
  ? StateSignal<
      Prettify<
        Pick<
          StoreFeatures['state'],
          keyof {
            [PropName in Config['readonlyExcept'][number]]: true;
          }
        >
      >
    >
  : StateSignal<Prettify<StoreFeatures['state']>>;
