import { getGlobalThis } from './get-global-this';

/**
 *
 * @description
 * Determines the used view engine of an Angular project is Ivy or not.
 * The check is done based on following table:
 * | render       | ViewEngine | ViewEngine | Ivy         | Ivy         |
 * | ------------ | ---------- | ---------- | ----------- | ----------- |
 * | **mode**     | prod       | dev        | prod        | dev         |
 * | **ng**       | present    | present    | `undefined` | present     |
 * | **ng.probe** | present    | present    | `undefined` | `undefined` |
 *
 *  So for Ivy we need to make sure that ng is undefined or,
 *  in case of dev environment, ng.probe is undefined.
 *
 * @return {boolean} - true if the used view engine is Ivy.
 *
 */
export function isViewEngineIvy(): boolean {
  const ng: any = getGlobalThis().ng;

  // Is the global ng object is unavailable?
  // ng === undefined in Ivy production mode
  // View Engine has the ng object both in development mode and production mode.
  return (
    ng === undefined ||
    // in case we are in dev mode in ivy
    // `probe` property is available on ng object we use View Engine.
    ng.probe === undefined
  );
}
