import { defaultAssert, observableMatcher } from './observableMatcher';

export const jestMatcher = observableMatcher(defaultAssert, (a, e) =>
  expect(a).toStrictEqual(e)
);
