import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreModule, Store, ActionsSubject } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtools } from '@ngrx/store-devtools';

describe('Devtools Integration', () => {
  let store: Store<any>;

  @NgModule({
    imports: [StoreModule.forFeature('a', (state: any, action: any) => state)],
  })
  class EagerFeatureModule {}

  @NgModule({
    imports: [
      StoreModule.forRoot({}),
      EagerFeatureModule,
      StoreDevtoolsModule.instrument(),
    ],
  })
  class RootModule {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RootModule],
    });
  });

  it('should load the store eagerly', () => {
    let error = false;

    try {
      let store = TestBed.get(Store);
      store.subscribe();
    } catch (e) {
      error = true;
    }

    expect(error).toBeFalsy();
  });
});
