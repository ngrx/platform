export { extendResource } from './extend-resource';
export { ERROR_EXTENSION_TYPE, LOADING_EXTENSION_TYPE } from './consts';
export { ResourceExtension } from './models';
export {
  provideResourceExtensions,
  RESOURCE_EXTENSIONS,
} from './provide-resource-extensions';

export { withPreviousValueOnError } from './extensions/with-previous-value-on-error';
export { withPreviousValueOnLoading } from './extensions/with-previous-value-on-loading';
export { withValueOnError } from './extensions/with-value-on-error';
export { withValueOnLoading } from './extensions/with-value-on-loading';
