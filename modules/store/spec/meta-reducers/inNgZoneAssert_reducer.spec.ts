import * as ngCore from '@angular/core';
import { inNgZoneAssertMetaReducer } from '../../src/meta-reducers/inNgZoneAssert_reducer';

// Patch for all tests as they are never actually running in NgZone.
beforeAll(() => {
  ngCore.NgZone.isInAngularZone = jasmine
    .createSpy('isInAngularZone')
    .and.returnValue(true);
});

describe('inNgZoneAssertMetaReducer:', () => {
  // Reset the spy after tests to prevent breaking other specs.
  afterAll(() => {
    ngCore.NgZone.isInAngularZone = jasmine
      .createSpy('isInAngularZone')
      .and.returnValue(true);
  });

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
      /Action not running in NgZone/
    );
    expect(ngCore.NgZone.isInAngularZone).toHaveBeenCalled();
  });

  it('should not call isInAngularZone when check is off and in zone', () => {
    ngCore.NgZone.isInAngularZone = jasmine
      .createSpy('isInAngularZone')
      .and.returnValue(true);
    expect(() =>
      invokeActionReducer((state: any) => state, false)
    ).not.toThrow();
    expect(ngCore.NgZone.isInAngularZone).not.toHaveBeenCalled();
  });
  it('should not call isInAngularZone and not throw when check is off and out of zone', () => {
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
