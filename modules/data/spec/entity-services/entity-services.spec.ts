import { TestBed } from '@angular/core/testing';
import { Action, StoreModule, Store } from '@ngrx/store';
import { Actions, EffectsModule } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { first, skip } from 'rxjs/operators';

import {
  EntityAction,
  EntityOp,
  EntityCacheQuerySet,
  MergeQuerySet,
  EntityMetadataMap,
  EntityDataModule,
  EntityCacheEffects,
  EntityDataService,
  EntityActionFactory,
  EntityDispatcherFactory,
  EntityServices,
  EntityCache,
  HttpMethods,
  DataServiceError,
  Logger,
} from '../..';

describe('EntityServices', () => {
  describe('entityActionErrors$', () => {
    it('should emit EntityAction errors for multiple entity types', () => {
      const errors: EntityAction[] = [];
      const { entityActionFactory, entityServices } = entityServicesSetup();
      entityServices.entityActionErrors$.subscribe((error) =>
        errors.push(error)
      );

      entityServices.dispatch({ type: 'not-an-entity-action' });
      entityServices.dispatch(
        entityActionFactory.create('Hero', EntityOp.QUERY_ALL)
      ); // not an error
      entityServices.dispatch(
        entityActionFactory.create(
          'Hero',
          EntityOp.QUERY_ALL_ERROR,
          makeDataServiceError('GET', new Error('Bad hero news'))
        )
      );
      entityServices.dispatch(
        entityActionFactory.create('Villain', EntityOp.QUERY_ALL)
      ); // not an error
      entityServices.dispatch(
        entityActionFactory.create(
          'Villain',
          EntityOp.SAVE_ADD_ONE_ERROR,
          makeDataServiceError('PUT', new Error('Bad villain news'))
        )
      );

      expect(errors.length).toBe(2);
    });
  });

  describe('entityCache$', () => {
    it('should observe the entire entity cache', () => {
      const entityCacheValues: any = [];

      const {
        entityActionFactory,
        entityServices,
        store,
      } = entityServicesSetup();

      // entityCache$.subscribe() callback invoked immediately. The cache is empty at first.
      entityServices.entityCache$.subscribe((ec) => entityCacheValues.push(ec));

      // This first action to go through the Hero's EntityCollectionReducer
      // creates the collection in the EntityCache as a side-effect,
      // triggering the second entityCache$.subscribe() callback
      const heroAction = entityActionFactory.create(
        'Hero',
        EntityOp.SET_FILTER,
        'test'
      );
      store.dispatch(heroAction);

      expect(entityCacheValues.length).toEqual(2);
      expect(entityCacheValues[0]).toEqual({});
      expect(entityCacheValues[1].Hero).toBeDefined();
    });
  });

  describe('dispatch(MergeQuerySet)', () => {
    // using async test to guard against false test pass.
    it('should update entityCache$ twice after merging two individual collections', (done: any) => {
      const hero1 = { id: 1, name: 'A' } as Hero;
      const hero2 = { id: 2, name: 'B' } as Hero;
      const heroes = [hero1, hero2];

      const villain = { key: 'DE', name: 'Dr. Evil' } as Villain;

      const { entityServices } = entityServicesSetup();
      const heroCollectionService = entityServices.getEntityCollectionService<Hero>(
        'Hero'
      );
      const villainCollectionService = entityServices.getEntityCollectionService<Villain>(
        'Villain'
      );

      const entityCacheValues: any = [];
      entityServices.entityCache$.subscribe((cache) => {
        entityCacheValues.push(cache);
        if (entityCacheValues.length === 3) {
          expect(entityCacheValues[0]).toEqual({});
          expect(entityCacheValues[1]['Hero'].ids).toEqual([1, 2]);
          expect(entityCacheValues[1]['Villain']).toBeUndefined();
          expect(entityCacheValues[2]['Villain'].entities['DE']).toEqual(
            villain
          );
          done();
        }
      });

      // Emulate what would happen if had queried collections separately
      heroCollectionService.createAndDispatch(
        EntityOp.QUERY_MANY_SUCCESS,
        heroes
      );
      villainCollectionService.createAndDispatch(
        EntityOp.QUERY_BY_KEY_SUCCESS,
        villain
      );
    });

    // using async test to guard against false test pass.
    it('should update entityCache$ once when MergeQuerySet multiple collections', (done: any) => {
      const hero1 = { id: 1, name: 'A' } as Hero;
      const hero2 = { id: 2, name: 'B' } as Hero;
      const heroes = [hero1, hero2];
      const villain = { key: 'DE', name: 'Dr. Evil' } as Villain;
      const querySet: EntityCacheQuerySet = {
        Hero: heroes,
        Villain: [villain],
      };
      const action = new MergeQuerySet(querySet);

      const { entityServices } = entityServicesSetup();

      // Skip initial value. Want the first one after merge is dispatched
      entityServices.entityCache$.pipe(skip(1), first()).subscribe((cache) => {
        expect(cache['Hero'].ids).toEqual([1, 2]);
        expect(cache['Villain'].entities['DE']).toEqual(villain);
        done();
      });
      entityServices.dispatch(action);
    });
  });
});

// #region test helpers
class Hero {
  id!: number;
  name!: string;
  saying?: string;
}
class Villain {
  key!: string;
  name!: string;
}

const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: { selectId: (villain) => villain.key },
};

function entityServicesSetup() {
  const logger = {
    error: jasmine.createSpy('error'),
    log: jasmine.createSpy('log'),
    warn: jasmine.createSpy('warn'),
  };

  TestBed.configureTestingModule({
    imports: [
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      EntityDataModule.forRoot({
        entityMetadata: entityMetadata,
      }),
    ],
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    providers: [
      { provide: EntityCacheEffects, useValue: {} },
      { provide: EntityDataService, useValue: null },
      { provide: Logger, useValue: logger },
    ],
  });

  const actions$: Observable<Action> = TestBed.inject(Actions);
  const entityActionFactory: EntityActionFactory = TestBed.inject(
    EntityActionFactory
  );
  const entityDispatcherFactory: EntityDispatcherFactory = TestBed.inject(
    EntityDispatcherFactory
  );
  const entityServices: EntityServices = TestBed.inject(EntityServices);
  const store: Store<EntityCache> = TestBed.inject(Store);

  return {
    actions$,
    entityActionFactory,
    entityServices,
    store,
  };
}

/** make error produced by the EntityDataService */
function makeDataServiceError(
  /** Http method for that action */
  method: HttpMethods,
  /** Http error from the web api */
  httpError?: any,
  /** Options sent with the request */
  options?: any
) {
  let url = 'api/heroes';
  if (httpError) {
    url = httpError.url || url;
  } else {
    httpError = { error: new Error('Test error'), status: 500, url };
  }
  return new DataServiceError(httpError, { method, url, options });
}
// #endregion test helpers
