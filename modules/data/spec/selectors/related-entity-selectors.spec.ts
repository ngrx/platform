import { TestBed } from '@angular/core/testing';
import { createSelector, StoreModule, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

import {
  EntityMetadataMap,
  EntityActionFactory,
  EntitySelectorsFactory,
  EntityCache,
  EntityDataModuleWithoutEffects,
  ENTITY_METADATA_TOKEN,
  EntityOp,
  EntityAction,
} from '../../';

const entityMetadataMap: EntityMetadataMap = {
  Battle: {},
  Hero: {},
  HeroPowerMap: {},
  Power: {
    sortComparer: sortByName,
  },
  Sidekick: {},
};

describe('Related-entity Selectors', () => {
  // #region setup
  let eaFactory: EntityActionFactory;
  let entitySelectorsFactory: EntitySelectorsFactory;
  let store: Store<EntityCache>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EntityDataModuleWithoutEffects],
      providers: [
        // required by EntityData but not used in these tests
        { provide: Actions, useValue: null },
        {
          provide: ENTITY_METADATA_TOKEN,
          multi: true,
          useValue: entityMetadataMap,
        },
      ],
    });

    store = TestBed.inject(Store);
    eaFactory = TestBed.inject(EntityActionFactory);
    entitySelectorsFactory = TestBed.inject(EntitySelectorsFactory);
    initializeCache(eaFactory, store);
  });

  // #endregion setup

  describe('hero -> sidekick (1-1)', () => {
    function setCollectionSelectors() {
      const heroSelectors = entitySelectorsFactory.create<Hero>('Hero');
      const selectHeroMap = heroSelectors.selectEntityMap;

      const sidekickSelectors = entitySelectorsFactory.create<Sidekick>(
        'Sidekick'
      );
      const selectSidekickMap = sidekickSelectors.selectEntityMap;

      return {
        selectHeroMap,
        selectSidekickMap,
      };
    }

    function createHeroSidekickSelector$(heroId: number): Observable<Sidekick> {
      const { selectHeroMap, selectSidekickMap } = setCollectionSelectors();
      const selectHero = createSelector(
        selectHeroMap,
        (heroes) => heroes[heroId]
      );
      const selectSideKick = createSelector(
        selectHero,
        selectSidekickMap,
        (hero, sidekicks) => {
          const sidekickId = hero && hero.sidekickFk!;
          return sidekickId && sidekicks[sidekickId];
        }
      );
      return store.select(selectSideKick) as Observable<Sidekick>;
    }

    // Note: async done() callback ensures test passes only if subscribe(successCallback()) called.

    it('should get Alpha Hero sidekick', (done: any) => {
      createHeroSidekickSelector$(1).subscribe((sk) => {
        expect(sk.name).toBe('Bob');
        done();
      });
    });

    it('should get Alpha Hero updated sidekick', (done: any) => {
      // Skip the initial sidekick and check the one after update
      createHeroSidekickSelector$(1)
        .pipe(skip(1))
        .subscribe((sk) => {
          expect(sk.name).toBe('Robert');
          done();
        });

      // update the related sidekick
      const action = eaFactory.create<Update<Sidekick>>(
        'Sidekick',
        EntityOp.UPDATE_ONE,
        { id: 1, changes: { id: 1, name: 'Robert' } }
      );
      store.dispatch(action);
    });

    it('should get Alpha Hero changed sidekick', (done: any) => {
      // Skip the initial sidekick and check the one after update
      createHeroSidekickSelector$(1)
        .pipe(skip(1))
        .subscribe((sk) => {
          expect(sk.name).toBe('Sally');
          done();
        });

      // update the hero's sidekick from fk=1 to fk=2
      const action = eaFactory.create<Update<Hero>>(
        'Hero',
        EntityOp.UPDATE_ONE,
        { id: 1, changes: { id: 1, sidekickFk: 2 } } // Sally
      );
      store.dispatch(action);
    });

    it('changing a different hero should NOT trigger first hero selector', (done: any) => {
      let alphaCount = 0;

      createHeroSidekickSelector$(1).subscribe((sk) => {
        alphaCount += 1;
      });

      // update a different hero's sidekick from fk=2 (Sally) to fk=1 (Bob)
      createHeroSidekickSelector$(2)
        .pipe(skip(1))
        .subscribe((sk) => {
          expect(sk.name).toBe('Bob');
          expect(alphaCount).toEqual(1);
          done();
        });

      const action = eaFactory.create<Update<Hero>>(
        'Hero',
        EntityOp.UPDATE_ONE,
        { id: 2, changes: { id: 2, sidekickFk: 1 } } // Bob
      );
      store.dispatch(action);
    });

    it('should get undefined sidekick if hero not found', (done: any) => {
      createHeroSidekickSelector$(1234).subscribe((sk) => {
        expect(sk).toBeUndefined();
        done();
      });
    });

    it('should get undefined sidekick from Gamma because it has no sidekickFk', (done: any) => {
      createHeroSidekickSelector$(3).subscribe((sk) => {
        expect(sk).toBeUndefined();
        done();
      });
    });

    it('should get Gamma sidekick after creating and assigning one', (done: any) => {
      // Skip(1), the initial state in which Gamma has no sidekick
      // Note that BOTH dispatches complete synchronously, before the selector updates
      // so we only have to skip one.
      createHeroSidekickSelector$(3)
        .pipe(skip(1))
        .subscribe((sk) => {
          expect(sk.name).toBe('Robin');
          done();
        });

      // create a new sidekick
      let action: EntityAction = eaFactory.create<Sidekick>(
        'Sidekick',
        EntityOp.ADD_ONE,
        {
          id: 42,
          name: 'Robin',
        }
      );
      store.dispatch(action);

      // assign new sidekick to Gamma
      action = eaFactory.create<Update<Hero>>('Hero', EntityOp.UPDATE_ONE, {
        id: 3,
        changes: { id: 3, sidekickFk: 42 },
      });
      store.dispatch(action);
    });
  });

  describe('hero -> battles (1-m)', () => {
    function setCollectionSelectors() {
      const heroSelectors = entitySelectorsFactory.create<Hero>('Hero');
      const selectHeroMap = heroSelectors.selectEntityMap;

      const battleSelectors = entitySelectorsFactory.create<Battle>('Battle');
      const selectBattleEntities = battleSelectors.selectEntities;

      const selectHeroBattleMap = createSelector(
        selectBattleEntities,
        (battles) =>
          battles.reduce((acc, battle) => {
            const hid = battle.heroFk;
            if (hid) {
              const hbs = acc[hid];
              if (hbs) {
                hbs.push(battle);
              } else {
                acc[hid] = [battle];
              }
            }
            return acc;
          }, {} as { [heroId: number]: Battle[] })
      );

      return {
        selectHeroMap,
        selectHeroBattleMap,
      };
    }

    function createHeroBattlesSelector$(heroId: number): Observable<Battle[]> {
      const { selectHeroMap, selectHeroBattleMap } = setCollectionSelectors();

      const selectHero = createSelector(
        selectHeroMap,
        (heroes) => heroes[heroId]
      );

      const selectHeroBattles = createSelector(
        selectHero,
        selectHeroBattleMap,
        (hero, heroBattleMap) => {
          const hid = hero && hero.id;
          return (hid && heroBattleMap[hid]) || [];
        }
      );
      return store.select(selectHeroBattles);
    }

    // TODO: more tests
    // Note: async done() callback ensures test passes only if subscribe(successCallback()) called.

    it('should get Alpha Hero battles', (done: any) => {
      createHeroBattlesSelector$(1).subscribe((battles) => {
        expect(battles.length).toBe(3);
        done();
      });
    });

    it('should get Alpha Hero battles again after updating one of its battles', (done: any) => {
      // Skip the initial sidekick and check the one after update
      createHeroBattlesSelector$(1)
        .pipe(skip(1))
        .subscribe((battles) => {
          expect(battles[0].name).toBe('Scalliwag');
          done();
        });

      // update the first of the related battles
      const action = eaFactory.create<Update<Battle>>(
        'Battle',
        EntityOp.UPDATE_ONE,
        { id: 100, changes: { id: 100, name: 'Scalliwag' } }
      );
      store.dispatch(action);
    });

    it('Gamma Hero should have no battles', (done: any) => {
      createHeroBattlesSelector$(3).subscribe((battles) => {
        expect(battles.length).toBe(0);
        done();
      });
    });
  });

  describe('hero -> heropower <- power (m-m)', () => {
    function setCollectionSelectors() {
      const heroSelectors = entitySelectorsFactory.create<Hero>('Hero');
      const selectHeroMap = heroSelectors.selectEntityMap;

      const powerSelectors = entitySelectorsFactory.create<Power>('Power');
      const selectPowerMap = powerSelectors.selectEntityMap;

      const heroPowerMapSelectors = entitySelectorsFactory.create<HeroPowerMap>(
        'HeroPowerMap'
      );
      const selectHeroPowerMapEntities = heroPowerMapSelectors.selectEntities;

      const selectHeroPowerIds = createSelector(
        selectHeroPowerMapEntities,
        (hpMaps) =>
          hpMaps.reduce((acc, hpMap) => {
            const hid = hpMap.heroFk;
            if (hid) {
              const hpIds = acc[hid];
              if (hpIds) {
                hpIds.push(hpMap.powerFk);
              } else {
                acc[hid] = [hpMap.powerFk];
              }
            }
            return acc;
          }, {} as { [heroId: number]: number[] })
      );

      return {
        selectHeroMap,
        selectHeroPowerIds,
        selectPowerMap,
      };
    }

    function createHeroPowersSelector$(heroId: number): Observable<Power[]> {
      const {
        selectHeroMap,
        selectHeroPowerIds,
        selectPowerMap,
      } = setCollectionSelectors();

      const selectHero = createSelector(
        selectHeroMap,
        (heroes) => heroes[heroId]
      );

      const selectHeroPowers = createSelector(
        selectHero,
        selectHeroPowerIds,
        selectPowerMap,
        (hero, heroPowerIds, powerMap) => {
          const hid = hero && hero.id;
          const pids = (hid && heroPowerIds[hid]) || [];
          const powers = pids
            .map((id) => powerMap[id])
            .filter((power) => power);
          return powers;
        }
      );
      return store.select(selectHeroPowers) as Observable<Power[]>;
    }

    // TODO: more tests
    // Note: async done() callback ensures test passes only if subscribe(successCallback()) called.

    it('should get Alpha Hero powers', (done: any) => {
      createHeroPowersSelector$(1).subscribe((powers) => {
        expect(powers.length).toBe(3);
        done();
      });
    });

    it('should get Beta Hero power', (done: any) => {
      createHeroPowersSelector$(2).subscribe((powers) => {
        expect(powers.length).toBe(1);
        expect(powers[0].name).toBe('Invisibility');
        done();
      });
    });

    it('Beta Hero should have no powers after delete', (done: any) => {
      createHeroPowersSelector$(2)
        .pipe(skip(1))
        .subscribe((powers) => {
          expect(powers.length).toBe(0);
          done();
        });

      // delete Beta's one power via the HeroPowerMap
      const action: EntityAction = eaFactory.create<number>(
        'HeroPowerMap',
        EntityOp.REMOVE_ONE,
        96
      );
      store.dispatch(action);
    });

    it('Gamma Hero should have no powers', (done: any) => {
      createHeroPowersSelector$(3).subscribe((powers) => {
        expect(powers.length).toBe(0);
        done();
      });
    });
  });
});

// #region Test support

interface Hero {
  id: number;
  name: string;
  saying?: string;
  sidekickFk?: number;
}

interface Battle {
  id: number;
  name: string;
  heroFk: number;
  won: boolean;
}

interface HeroPowerMap {
  id: number;
  heroFk: number;
  powerFk: number;
}

interface Power {
  id: number;
  name: string;
}

interface Sidekick {
  id: number;
  name: string;
}

/** Sort Comparer to sort the entity collection by its name property */
export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

function initializeCache(
  eaFactory: EntityActionFactory,
  store: Store<EntityCache>
) {
  let action: EntityAction;

  action = eaFactory.create<Sidekick[]>('Sidekick', EntityOp.ADD_ALL, [
    { id: 1, name: 'Bob' },
    { id: 2, name: 'Sally' },
  ]);
  store.dispatch(action);

  action = eaFactory.create<Hero[]>('Hero', EntityOp.ADD_ALL, [
    { id: 1, name: 'Alpha', sidekickFk: 1 },
    { id: 2, name: 'Beta', sidekickFk: 2 },
    { id: 3, name: 'Gamma' }, // no sidekick
  ]);
  store.dispatch(action);

  action = eaFactory.create<Battle[]>('Battle', EntityOp.ADD_ALL, [
    { id: 100, heroFk: 1, name: 'Plains of Yon', won: true },
    { id: 200, heroFk: 1, name: 'Yippee-kai-eh', won: false },
    { id: 300, heroFk: 1, name: 'Yada Yada', won: true },
    { id: 400, heroFk: 2, name: 'Tally-hoo', won: true },
  ]);
  store.dispatch(action);

  action = eaFactory.create<Power[]>('Power', EntityOp.ADD_ALL, [
    { id: 10, name: 'Speed' },
    { id: 20, name: 'Strength' },
    { id: 30, name: 'Invisibility' },
  ]);
  store.dispatch(action);

  action = eaFactory.create<HeroPowerMap[]>('HeroPowerMap', EntityOp.ADD_ALL, [
    { id: 99, heroFk: 1, powerFk: 10 },
    { id: 98, heroFk: 1, powerFk: 20 },
    { id: 97, heroFk: 1, powerFk: 30 },
    { id: 96, heroFk: 2, powerFk: 30 },
    // Gamma has no powers
  ]);
  store.dispatch(action);
}
// #endregion Test support
