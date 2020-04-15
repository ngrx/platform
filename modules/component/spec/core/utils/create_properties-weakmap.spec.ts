import { createPropertiesWeakMap } from '../../../src/core/utils';

const propertyNameString = 'flag';
const propertyNameSymbol = Symbol('flag');
interface ManagedProperties {
  flag: boolean;
}
let contextObject: any;
const initialContextObjectState = {
  flag: 'original value',
};

//  **NOTICE:**
//  [WeakMaps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
//  don't hold hard references, so garbage collection will happen

describe('propertiesWeakMap', () => {
  beforeEach(() => {
    contextObject = { ...initialContextObjectState };
  });

  it('should not conflict with properties nor mutate the contextObject when using a weakMap', () => {
    const propertiesWeakMap = createPropertiesWeakMap<
      object,
      ManagedProperties
    >((o: object) => ({ flag: false }));

    expect(contextObject.flag).toBe(initialContextObjectState.flag);
    expect(propertiesWeakMap.getProps(contextObject).flag).toBe(
      initialContextObjectState.flag
    );
    expect(
      Reflect.ownKeys(propertiesWeakMap.getProps(contextObject)).length
    ).toBe(1);

    propertiesWeakMap.setProps(contextObject, { flag: true });
    expect(contextObject.flag).toBe(initialContextObjectState.flag);
    expect(Reflect.ownKeys(contextObject).length).toStrictEqual(
      Reflect.ownKeys(initialContextObjectState).length
    );
    expect(
      Reflect.ownKeys(propertiesWeakMap.getProps(contextObject)).length
    ).toBe(1);
    expect(propertiesWeakMap.getProps(contextObject).flag).toBe(true);
  });

  describe('demonstration of the problem', () => {
    it('should conflict with properties and mutate the contextObject when using a string as property name', () => {
      expect(contextObject.flag).toBe(initialContextObjectState.flag);
      contextObject[propertyNameString] = true;
      expect(contextObject[propertyNameString]).not.toBe(
        initialContextObjectState.flag
      );
      expect(Reflect.ownKeys(contextObject).length).toBe(
        Reflect.ownKeys(initialContextObjectState).length
      );
    });

    it('should not conflict with properties but mutate the contextObject when using a symbol as property name', () => {
      expect(contextObject.flag).toBe(initialContextObjectState.flag);
      expect(contextObject[propertyNameSymbol]).toBe(undefined);

      contextObject[propertyNameSymbol] = true;
      expect(contextObject.flag).toBe(initialContextObjectState.flag);
      expect(contextObject).toBe(contextObject);
      expect(contextObject[propertyNameSymbol]).toBe(true);
      expect(Reflect.ownKeys(contextObject).length).not.toBe(
        Reflect.ownKeys(initialContextObjectState).length
      );
    });
  });
});
