import type { TSESLint } from '@typescript-eslint/utils';
import { parser } from 'typescript-eslint';
import { rules } from './rules';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import all from './configs/all';
import allTypeChecked from './configs/all-type-checked';
import store from './configs/store';
import effects from './configs/effects';
import effectsTypeChecked from './configs/effects-type-checked';
import componentStore from './configs/component-store';
import operators from './configs/operators';
import signals from './configs/signals';
import signalsTypeChecked from './configs/signals-type-checked';

const meta = { name: packageName, version: packageVersion };

const tsPlugin: TSESLint.FlatConfig.Plugin = {
  meta,
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

export default {
  meta,
  configs,
  rules,
};
export { configs, meta, rules };
