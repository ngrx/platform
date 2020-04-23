import { envZonePatched, getGlobalThis } from '../../../src/core/utils';
import { manualInstanceNgZone, mockPromise } from '../../fixtures/fixtures';

// @TODO use better solution to type that
type AnyObject = { [prop: string]: any };
function mutationManagerFactory<T>(obj: AnyObject, props: AnyObject) {
  const originals: AnyObject = Object.entries(props).reduce(
    (originals: AnyObject, [prop, defaultValue]: [string, any]): AnyObject => {
      return {
        ...originals,
        [prop]: obj.hasOwnProperty(prop) ? obj[prop] : defaultValue,
      };
    },
    {}
  );

  return {
    restore: () => {
      Object.entries(originals).forEach(([prop, value]) => {
        obj[prop] = value;
      });
    },
    set: (prop: string, value: any) => {
      obj[prop] = value;
    },
  };
}

const mutationManager = mutationManagerFactory(getGlobalThis(), {
  Zone: manualInstanceNgZone,
});

describe('envZonePatched', () => {
  beforeEach(() => {
    mutationManager.restore();
  });

  it('should return true if `zone.js` did patch the global API', () => {
    mutationManager.set('Zone', manualInstanceNgZone);
    expect(envZonePatched()).toBe(true);
  });

  it('should return false if `zone.js` did not patch the global API', () => {
    mutationManager.set('Zone', undefined);
    expect(envZonePatched()).toBe(false);
  });
});
