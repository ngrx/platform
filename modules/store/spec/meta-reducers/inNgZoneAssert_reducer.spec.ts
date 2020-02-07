import * as ngCore from '@angular/core';
import { inNgZoneAssertMetaReducer } from '../../src/meta-reducers/inNgZoneAssert_reducer';

describe('inNgZoneAssertMetaReducer:', () => {
  it('should not throw if in NgZone', () => {
    ngCore.NgZone.isInAngularZone = jasmine
      .createSpy('isInAngularZone')
      .and.returnValue(true);
    expect(() => invokeActionReducer((state: any) => state)).not.toThrow();
    expect(ngCore.NgZone.isInAngularZone).toHaveBeenCalled();
  });

  it('should throw when not in NgZone', () => {
    ngCore.NgZone.isInAngularZone = jasmine
      .createSpy('isInAngularZone')
      .and.returnValue(false);
    expect(() => invokeActionReducer((state: any) => state)).toThrowError(
      `Action 'invoke' running outside NgZone. ChangeDetection will not be triggered by any event in this call stack.`
    );
    expect(ngCore.NgZone.isInAngularZone).toHaveBeenCalled();
  });

  it('should not call isInAngularZone when check is off', () => {
    ngCore.NgZone.isInAngularZone = jasmine
      .createSpy('isInAngularZone')
      .and.returnValue(false);
    expect(() =>
      invokeActionReducer((state: any) => state, false)
    ).not.toThrow();
    expect(ngCore.NgZone.isInAngularZone).not.toHaveBeenCalled();
  });

  function invokeActionReducer(reduce: Function, checkIsOn = true) {
    inNgZoneAssertMetaReducer((state, action) => reduce(state, action), {
      action: checkIsOn,
    })({}, { type: 'invoke' });
  }
});
