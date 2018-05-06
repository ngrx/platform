import {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
} from './utility/strings';

export * from './utility/ast-utils';
export * from './utility/change';
export * from './utility/config';
export * from './utility/find-module';
export * from './utility/ngrx-utils';
export * from './utility/project';
export * from './utility/route-utils';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
};
