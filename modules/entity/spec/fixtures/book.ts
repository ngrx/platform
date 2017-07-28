const deepFreeze = require('deep-freeze');

export interface BookModel {
  id: string;
  title: string;
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
});
