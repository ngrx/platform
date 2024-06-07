import { TSESLint } from '@typescript-eslint/utils';
import { parser } from 'typescript-eslint';
import { rules } from '../src/rules';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import recommended from '../src/configs/recommended';
import all from '../src/configs/all';
import storeRecommended from '../src/configs/store-recommended';
import storeAll from '../src/configs/store-all';
import effectsRecommended from '../src/configs/effects-recommended';
import effectsAll from '../src/configs/effects-all';
import componentStoreRecommended from '../src/configs/component-store-recommended';
import componentStoreAll from '../src/configs/component-store-all';
import operatorsRecommended from '../src/configs/operators-recommended';
import operatorsAll from '../src/configs/operators-all';
import signalsRecommended from '../src/configs/signals-recommended';
import signalsAll from '../src/configs/signals-all';

const meta = { name: packageName, version: packageVersion };

const tsPlugin: TSESLint.FlatConfig.Plugin = {
  rules,
};

const configs = {
  recommended: recommended(tsPlugin, parser),
  all: all(tsPlugin, parser),

  storeRecommended: storeRecommended(tsPlugin, parser),
  storeAll: storeAll(tsPlugin, parser),

  effectsRecommended: effectsRecommended(tsPlugin, parser),
  effectsAll: effectsAll(tsPlugin, parser),

  componentStoreRecommended: componentStoreRecommended(tsPlugin, parser),
  componentStoreAll: componentStoreAll(tsPlugin, parser),

  operatorsRecommended: operatorsRecommended(tsPlugin, parser),
  operatorsAll: operatorsAll(tsPlugin, parser),

  signalsRecommended: signalsRecommended(tsPlugin, parser),
  signalsAll: signalsAll(tsPlugin, parser),
};

/*
As the angular-eslint plugin we do both a default and named exports to allow people to use this package from
both CJS and ESM in very natural ways. 
*/
export default {
  meta,
  configs,
};
export { meta, configs };
