import { getGlobalThis } from './get-global-this';

/**
 * @description
 *
 * Determines if the application runs with ivy or not (ViewEngine)
 *
 * @usageNotes
 *
 * The function can be just imported and used everywhere.
 *
 * ```ts
 * import { isIvy } from `utils/is-ivy`;
 *
 * console.log(isIvy());  // true or false
 * ```
 *
 * The determination if an application runs with Ivy or not is done by following table:
 *
 * **Table for ng global presence in ViewEngine and Ivy for prod/dev modes**
 *
 *  | render   | ViewEngine | ViewEngine | Ivy       | Ivy       |
 *  | -------- | ---------- | ---------- | --------- | --------  |
 *  | mode     | prod       | dev        | prod      | dev       |
 *  | ng       | present    | present    | undefined | present   |
 *  | ng.probe | present    | present    | undefined | undefined |
 *
 *  > So for Ivy we need to make sure that ng is undefined or,
 *  > in case of dev environment, ng.probe is undefined
 *
 */
export function isIvy(): boolean {
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
