/**
 * @experimental
 * @description
 *
 * Used with the `eventCreator` and `eventCreatorGroup` functions to define
 * the type of additional event properties.
 */
export function props<Props extends object>(): Props {
  return {} as Props;
}

/**
 * @experimental
 * @description
 *
 * Used with the `eventCreatorGroup` function to define an event creator
 * without additional properties.
 */
export function emptyProps(): undefined {
  return undefined;
}
