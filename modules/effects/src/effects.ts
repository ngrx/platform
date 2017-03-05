import { merge } from 'rxjs/observable/merge';
import { ignoreElements } from 'rxjs/operator/ignoreElements';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

const METADATA_KEY = '@ngrx/effects';

export interface EffectMetadata {
  propertyName: string;
  dispatch: boolean;
}

export function Effect({ dispatch } = { dispatch: true }): PropertyDecorator {
  return function(target: any, propertyName: string) {
    if (!(Reflect as any).hasOwnMetadata(METADATA_KEY, target)) {
      (Reflect as any).defineMetadata(METADATA_KEY, [], target);
    }

    const effects: EffectMetadata[] = (Reflect as any).getOwnMetadata(METADATA_KEY, target);
    const metadata: EffectMetadata = { propertyName, dispatch };

    (Reflect as any).defineMetadata(METADATA_KEY, [ ...effects, metadata ], target);
  };
}

export function getEffectsMetadata(instance: any): EffectMetadata[] {
  const target = Object.getPrototypeOf(instance);

  if (!(Reflect as any).hasOwnMetadata(METADATA_KEY, target)) {
    return [];
  }

  return (Reflect as any).getOwnMetadata(METADATA_KEY, target);
}

export function mergeEffects(instance: any): Observable<any> {
  const observables: Observable<any>[] = getEffectsMetadata(instance).map(
    ({ propertyName, dispatch }): Observable<any> => {
      const observable = typeof instance[propertyName] === 'function' ?
        instance[propertyName]() : instance[propertyName];

      if (dispatch === false) {
        return ignoreElements.call(observable);
      }

      return observable;
    }
  );

  return merge(...observables);
}
