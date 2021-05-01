import { Action } from '@ngrx/store';

import { Subject } from 'rxjs';

import {
  EntityAction,
  EntityActionFactory,
  EntityOp,
  ofEntityType,
  ofEntityOp,
} from '../../';

// Todo: consider marble testing
describe('EntityAction Operators', () => {
  // factory never changes in these tests
  const entityActionFactory = new EntityActionFactory();

  let results: any[];
  let actions: Subject<EntityAction>;

  const testActions = {
    FOO: <Action>{ type: 'Foo' },
    HERO_QUERY_ALL: entityActionFactory.create('Hero', EntityOp.QUERY_ALL),
    VILLAIN_QUERY_MANY: entityActionFactory.create(
      'Villain',
      EntityOp.QUERY_MANY
    ),
    HERO_DELETE: entityActionFactory.create(
      'Hero',
      EntityOp.SAVE_DELETE_ONE,
      42
    ),
    BAR: <Action>(<any>{ type: 'Bar', payload: 'bar' }),
  };

  function dispatchTestActions() {
    Object.keys(testActions).forEach((a) =>
      actions.next((<any>testActions)[a])
    );
  }

  beforeEach(() => {
    actions = new Subject<EntityAction>();
    results = [];
  });

  ///////////////

  it('#ofEntityType()', () => {
    // EntityActions of any kind
    actions.pipe(ofEntityType()).subscribe((ea) => results.push(ea));

    const expectedActions = [
      testActions.HERO_QUERY_ALL,
      testActions.VILLAIN_QUERY_MANY,
      testActions.HERO_DELETE,
    ];
    dispatchTestActions();
    expect(results).toEqual(expectedActions);
  });

  it(`#ofEntityType('SomeType')`, () => {
    // EntityActions of one type
    actions.pipe(ofEntityType('Hero')).subscribe((ea) => results.push(ea));

    const expectedActions = [
      testActions.HERO_QUERY_ALL,
      testActions.HERO_DELETE,
    ];
    dispatchTestActions();
    expect(results).toEqual(expectedActions);
  });

  it(`#ofEntityType('Type1', 'Type2', 'Type3')`, () => {
    // n.b. 'Bar' is not an EntityType even though it is an action type
    actions
      .pipe(ofEntityType('Hero', 'Villain', 'Bar'))
      .subscribe((ea) => results.push(ea));

    ofEntityTypeTest();
  });

  it('#ofEntityType(...arrayOfTypeNames)', () => {
    const types = ['Hero', 'Villain', 'Bar'];

    actions.pipe(ofEntityType(...types)).subscribe((ea) => results.push(ea));
    ofEntityTypeTest();
  });

  it('#ofEntityType(arrayOfTypeNames)', () => {
    const types = ['Hero', 'Villain', 'Bar'];

    actions.pipe(ofEntityType(types)).subscribe((ea) => results.push(ea));
    ofEntityTypeTest();
  });

  function ofEntityTypeTest() {
    const expectedActions = [
      testActions.HERO_QUERY_ALL,
      testActions.VILLAIN_QUERY_MANY,
      testActions.HERO_DELETE,
      // testActions.bar, // 'Bar' is not an EntityType
    ];
    dispatchTestActions();
    expect(results).toEqual(expectedActions);
  }

  it('#ofEntityType(...) is case sensitive', () => {
    // EntityActions of the 'hero' type, but it's lowercase so shouldn't match
    actions.pipe(ofEntityType('hero')).subscribe((ea) => results.push(ea));

    dispatchTestActions();
    expect(results).toEqual([]);
  });

  ///////////////

  it('#ofEntityOp with string args', () => {
    actions
      .pipe(ofEntityOp(EntityOp.QUERY_ALL, EntityOp.QUERY_MANY))
      .subscribe((ea) => results.push(ea));

    ofEntityOpTest();
  });

  it('#ofEntityOp with ...rest args', () => {
    const ops = [EntityOp.QUERY_ALL, EntityOp.QUERY_MANY];

    actions.pipe(ofEntityOp(...ops)).subscribe((ea) => results.push(ea));
    ofEntityOpTest();
  });

  it('#ofEntityOp with array args', () => {
    const ops = [EntityOp.QUERY_ALL, EntityOp.QUERY_MANY];

    actions.pipe(ofEntityOp(ops)).subscribe((ea) => results.push(ea));
    ofEntityOpTest();
  });

  it('#ofEntityOp()', () => {
    // EntityOps of any kind
    actions.pipe(ofEntityOp()).subscribe((ea) => results.push(ea));

    const expectedActions = [
      testActions.HERO_QUERY_ALL,
      testActions.VILLAIN_QUERY_MANY,
      testActions.HERO_DELETE,
    ];
    dispatchTestActions();
    expect(results).toEqual(expectedActions);
  });

  function ofEntityOpTest() {
    const expectedActions = [
      testActions.HERO_QUERY_ALL,
      testActions.VILLAIN_QUERY_MANY,
    ];
    dispatchTestActions();
    expect(results).toEqual(expectedActions);
  }
});
