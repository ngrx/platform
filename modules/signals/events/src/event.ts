/**
 * @experimental
 */
export type Event<Type extends string = string> = {
  type: Type;
};

/**
 * @experimental
 */
export type EventWithProps<
  Type extends string = string,
  Props extends object = object
> = Event<Type> & Props;

export function isEvent(value: unknown): value is Event {
  return typeof value === 'object' && value !== null && 'type' in value;
}
