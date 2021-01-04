import { compose } from '@ngrx/store';

import {
  DEFAULT_EFFECT_CONFIG,
  EffectConfig,
  EffectMetadata,
  EffectPropertyKey,
} from './models';
import { getSourceForInstance } from './utils';

const METADATA_KEY = '__@ngrx/effects__';

/**
 * @deprecated The Effect decorator (`@Effect`) is deprecated in favor for the `createEffect` method.
 * See the docs for more info {@link https://ngrx.io/guide/migration/v11#the-effect-decorator}
 */
export function Effect(config: EffectConfig = {}) {
  return function <T extends Object, K extends EffectPropertyKey<T>>(
    target: T,
    propertyName: K
  ) {
    const metadata: EffectMetadata<T> = {
      ...DEFAULT_EFFECT_CONFIG,
      ...config, // Overrides any defaults if values are provided
      propertyName,
    };
    addEffectMetadataEntry<T>(target, metadata);
  };
}

export function getEffectDecoratorMetadata<T>(
  instance: T
): EffectMetadata<T>[] {
  const effectsDecorators: EffectMetadata<T>[] = compose(
    getEffectMetadataEntries,
    getSourceForInstance
  )(instance);

  return effectsDecorators;
}

/**
 * Type guard to detemine whether METADATA_KEY is already present on the Class
 * constructor
 */
function hasMetadataEntries<T extends Object>(
  sourceProto: T
): sourceProto is typeof sourceProto & {
  constructor: typeof sourceProto.constructor & {
    [METADATA_KEY]: EffectMetadata<T>[];
  };
} {
  return sourceProto.constructor.hasOwnProperty(METADATA_KEY);
}

/** Add Effect Metadata to the Effect Class constructor under specific key */
function addEffectMetadataEntry<T extends object>(
  sourceProto: T,
  metadata: EffectMetadata<T>
) {
  if (hasMetadataEntries(sourceProto)) {
    sourceProto.constructor[METADATA_KEY].push(metadata);
  } else {
    Object.defineProperty(sourceProto.constructor, METADATA_KEY, {
      value: [metadata],
    });
  }
}

function getEffectMetadataEntries<T extends object>(
  sourceProto: T
): EffectMetadata<T>[] {
  return hasMetadataEntries(sourceProto)
    ? sourceProto.constructor[METADATA_KEY]
    : [];
}
