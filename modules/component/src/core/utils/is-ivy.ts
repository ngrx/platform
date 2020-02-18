import { getGlobalThis } from './get-global-this';

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
