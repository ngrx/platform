export let REGISTERED_ACTION_TYPES: { [actionType: string]: number } = {};

export function resetRegisteredActionTypes() {
  REGISTERED_ACTION_TYPES = {};
}
