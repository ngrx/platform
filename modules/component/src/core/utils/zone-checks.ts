/**
 * isNgZone
 *
 * @description
 *
 * This function takes any instance of a class and checks
 * if the constructor name is equal to `NgZone`.
 * This means the Angular application that instantiated this service assumes it runs in a ZuneLess environment,
 * and therefor it's change detection will not be triggered by zone related logic.
 *
 * However, keep in mind this does not mean `zone.js` is not present.
 * The environment could still run in ZoneFull mode even if Angular turned it off.
 * Consider the situation of a Angular element configured for ZoneLess
 * environments is used in an Angular application relining on the zone mechanism.
 *
 * @param instance - The instance to check for constructor name of `NgZone`.
 * @return boolean - true if instance is of type `NgZone`.
 *
 */
export function isNgZone(instance: any): boolean {
  return instance?.constructor?.name === 'NgZone';
}
