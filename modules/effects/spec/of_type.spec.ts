import { ofType, getOfTypeMetadata } from '../';
import { forceBasicMode } from '../src/of_type';
import { hot, cold } from 'jasmine-marbles';

describe('ofType', function() {
  const ADD = 'ADD';
  const SUBTRACT = 'SUBTRACT';
  const DIVIDE = 'DIVIDE';
  const MULTIPLY = 'MULTIPLY';

  it('should only emit values that are filtered out', () => {
    const input = cold('-a-b-c-d', {
      a: { type: ADD },
      b: { type: SUBTRACT },
      c: { type: DIVIDE },
      d: { type: MULTIPLY },
    });
    const expected = cold('-a-b', {
      a: { type: ADD },
      b: { type: SUBTRACT },
    });

    const additionAndSubtraction$ = input.pipe(ofType(ADD, SUBTRACT));
    expect(additionAndSubtraction$).toBeObservable(expected);
  });

  it('should only subscribe once to each action specified', () => {
    const input = cold('-a-b-c-d', {
      a: { type: ADD },
      b: { type: SUBTRACT },
      c: { type: DIVIDE },
      d: { type: MULTIPLY },
    });
    const expected = cold('-a-b', {
      a: { type: ADD },
      b: { type: SUBTRACT },
    });
    const expected2 = cold('----c-d', {
      c: { type: DIVIDE },
      d: { type: MULTIPLY },
    });

    const subscriptions = [
      input.pipe(ofType(ADD, SUBTRACT)).subscribe(),
      input.pipe(ofType(DIVIDE, MULTIPLY)).subscribe(),
    ];

    expect(getOfTypeMetadata(input).watchedActions.includes(ADD)).toBe(true);
    expect(getOfTypeMetadata(input).watchedActions.includes(SUBTRACT)).toBe(
      true
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(MULTIPLY)).toBe(
      true
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(DIVIDE)).toBe(true);
    expect(getOfTypeMetadata(input).subscriptionCount).toBe(2);

    subscriptions[0].unsubscribe();

    expect(getOfTypeMetadata(input).watchedActions.includes(ADD)).toBe(false);
    expect(getOfTypeMetadata(input).watchedActions.includes(SUBTRACT)).toBe(
      false
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(MULTIPLY)).toBe(
      true
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(DIVIDE)).toBe(true);
    expect(getOfTypeMetadata(input).subscriptionCount).toBe(1);

    subscriptions[1].unsubscribe();

    expect(getOfTypeMetadata(input).watchedActions.includes(ADD)).toBe(false);
    expect(getOfTypeMetadata(input).watchedActions.includes(SUBTRACT)).toBe(
      false
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(MULTIPLY)).toBe(
      false
    );
    expect(getOfTypeMetadata(input).watchedActions.includes(DIVIDE)).toBe(
      false
    );
    expect(getOfTypeMetadata(input).subscriptionCount).toBe(0);
  });

  it('should propogate errors', () => {
    const input = cold('-#', {});
    const expected = cold('-#', {});

    const additionAndSubtraction$ = input.pipe(ofType(ADD, SUBTRACT));
    expect(additionAndSubtraction$).toBeObservable(expected);
  });

  it('should allow basic mode to be forced, and still work', () => {
    forceBasicMode(true);
    const input = cold('-a-b-c-d', {
      a: { type: ADD },
      b: { type: SUBTRACT },
      c: { type: DIVIDE },
      d: { type: MULTIPLY },
    });
    const expected = cold('-a-b', {
      a: { type: ADD },
      b: { type: SUBTRACT },
    });

    const additionAndSubtraction$ = input.pipe(ofType(ADD, SUBTRACT));
    expect(additionAndSubtraction$).toBeObservable(expected);

    forceBasicMode(false);
  });
});
