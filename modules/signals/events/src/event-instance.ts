export type EventInstance<Type extends string, Payload> = {
  type: Type;
  payload: Payload;
};

export function isEventInstance(
  value: unknown
): value is EventInstance<string, unknown> {
  return typeof value === 'object' && value !== null && 'type' in value;
}
