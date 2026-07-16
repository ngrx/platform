/**
 * @experimental
 * @description
 *
 * Extension type shared by all extensions that customize the resource value
 * while it is loading. Custom loading extensions can reuse it so that only the
 * last one takes effect.
 */
export const LOADING_EXTENSION_TYPE = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'LOADING_EXTENSION_TYPE' : ''
);

/**
 * @experimental
 * @description
 *
 * Extension type shared by all extensions that customize the resource value
 * when it enters the error state. Custom error extensions can reuse it so that
 * only the last one takes effect.
 */
export const ERROR_EXTENSION_TYPE = Symbol(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'ERROR_EXTENSION_TYPE' : ''
);
