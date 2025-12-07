import { TSESLint } from '@typescript-eslint/utils';
import { parser } from 'typescript-eslint';
import { rules } from '../src/rules';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import all from '../src/configs/all';
import allTypeChecked from '../src/configs/all-type-checked';
import store from '../src/configs/store';
import effects from '../src/configs/effects';
import effectsTypeChecked from '../src/configs/effects-type-checked';
import componentStore from '../src/configs/component-store';
import operators from '../src/configs/operators';
import signals from '../src/configs/signals';
import signalsTypeChecked from '../src/configs/signals-type-checked';

const meta = { name: packageName, version: packageVersion };

const tsPlugin: TSESLint.FlatConfig.Plugin = {
  rules,
};

const configs = {
  all: all(tsPlugin, parser),
  allTypeChecked: allTypeChecked(tsPlugin, parser),
  store: store(tsPlugin, parser),
  effects: effects(tsPlugin, parser),
  effectsTypeChecked: effectsTypeChecked(tsPlugin, parser),
  componentStore: componentStore(tsPlugin, parser),
  operators: operators(tsPlugin, parser),
  signals: signals(tsPlugin, parser),
  signalsTypeChecked: signalsTypeChecked(tsPlugin, parser),
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
