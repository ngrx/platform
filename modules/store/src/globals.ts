/**
 * @public
 */
export const REGISTERED_ACTION_TYPES: { [actionType: string]: number } = {};

/**
 * @public
 */
export function resetRegisteredActionTypes() {
  for (const key of Object.keys(REGISTERED_ACTION_TYPES)) {
    delete REGISTERED_ACTION_TYPES[key];
  }
}
