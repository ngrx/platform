// eslint-disable-next-line @typescript-eslint/no-var-requires
const deepFreeze = require('deep-freeze');

export interface BookModel {
  id: string;
  title: string;
  description?: string;
}

export const AClockworkOrange: BookModel = deepFreeze({
  id: 'aco',
  title: 'A Clockwork Orange',
});

export const AnimalFarm: BookModel = deepFreeze({
  id: 'af',
  title: 'Animal Farm',
});

export const TheGreatGatsby: BookModel = deepFreeze({
  id: 'tgg',
  title: 'The Great Gatsby',
  description: 'A 1925 novel written by American author F. Scott Fitzgerald',
});
