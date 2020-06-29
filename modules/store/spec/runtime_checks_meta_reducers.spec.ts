import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, USER_RUNTIME_CHECKS } from '..';
import * as metaReducers from '../src/meta-reducers';

// mock to be able to spy on meta reducer methods
jest.mock('../src/meta-reducers');

describe('USER_RUNTIME_CHECKS Token', () => {
  it('should be possible to toggle runtime reducers via the Injection Token', () => {
    const serializationCheckMetaReducerSpy = spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    ).and.callThrough();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        {
          provide: USER_RUNTIME_CHECKS,
          useValue: {
            strictStateSerializability: true,
          },
        },
      ],
    });

    const _store = TestBed.inject(Store);
    expect(serializationCheckMetaReducerSpy).toHaveBeenCalled();
  });

  it('should not create a meta reducer if not desired', () => {
    const serializationCheckMetaReducerSpy = spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    ).and.callThrough();
    const inNgZoneAssertMetaReducerSpy = spyOn(
      metaReducers,
      'inNgZoneAssertMetaReducer'
    ).and.callThrough();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        {
          provide: USER_RUNTIME_CHECKS,
          useValue: {
            strictStateSerializability: false,
            strictActionWithinNgZone: false,
          },
        },
      ],
    });

    const _store = TestBed.inject(Store);
    expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
    expect(inNgZoneAssertMetaReducerSpy).not.toHaveBeenCalled();
  });

  it('should create immutability meta reducer without config', () => {
    const serializationCheckMetaReducerSpy = spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    ).and.callThrough();
    const immutabilityCheckMetaReducerSpy = spyOn(
      metaReducers,
      'immutabilityCheckMetaReducer'
    ).and.callThrough();

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        {
          provide: USER_RUNTIME_CHECKS,
          useValue: {},
        },
      ],
    });

    const _store = TestBed.inject(Store);
    expect(serializationCheckMetaReducerSpy).not.toHaveBeenCalled();
    expect(immutabilityCheckMetaReducerSpy).toHaveBeenCalled();
  });
});
