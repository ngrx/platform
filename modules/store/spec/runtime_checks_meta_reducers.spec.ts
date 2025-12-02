import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, USER_RUNTIME_CHECKS } from '..';
import * as metaReducers from '../src/meta-reducers';

// mock to be able to spy on meta reducer methods
vi.mock('../src/meta-reducers');

describe('USER_RUNTIME_CHECKS Token', () => {
  it('should be possible to toggle runtime reducers via the Injection Token', () => {
    const serializationCheckMetaReducerSpy = vi.spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    );

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

    // Needs to reset or else the test fails
    serializationCheckMetaReducerSpy.mockReset();
  });

  it('should not create a meta reducer if not desired', () => {
    const serializationCheckMetaReducerSpy = vi.spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    );
    const inNgZoneAssertMetaReducerSpy = vi.spyOn(
      metaReducers,
      'inNgZoneAssertMetaReducer'
    );

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

    // Needs to reset or else the test fails
    serializationCheckMetaReducerSpy.mockReset();
    inNgZoneAssertMetaReducerSpy.mockReset();
  });

  it('should create immutability meta reducer without config', () => {
    const serializationCheckMetaReducerSpy = vi.spyOn(
      metaReducers,
      'serializationCheckMetaReducer'
    );
    const immutabilityCheckMetaReducerSpy = vi.spyOn(
      metaReducers,
      'immutabilityCheckMetaReducer'
    );

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

    // Needs to reset or else the test fails
    serializationCheckMetaReducerSpy.mockReset();
    immutabilityCheckMetaReducerSpy.mockReset();
  });
});
