import { apiZonePatched, getGlobalThis } from '../utils';
import { defer, from, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

/** A shared promise instance to cause a delay of one microtask */
let resolvedPromise: Promise<void> | null = null;

function getResolvedPromise(): Promise<void> {
  resolvedPromise =
    resolvedPromise || apiZonePatched('Promise')
      ? (getGlobalThis().__zone_symbol__Promise.resolve() as Promise<void>)
      : Promise.resolve();
  return resolvedPromise;
}

export function getZoneUnPatchedDurationSelector(): () => Observable<number> {
  return () => defer(() => from(getResolvedPromise()).pipe(mapTo(1)));
}
