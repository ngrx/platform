const deepFreeze = require('deep-freeze');

export interface BookModel {
  _id: string;
  title: string;
}

export const AClockworkOrange: BookModel = deepFreeze({
  _id: 'aco',
  title: 'A Clockwork Orange',
});

export const AnimalFarm: BookModel = deepFreeze({
  _id: 'af',
  title: 'Animal Farm',
});

export const TheGreatGatsby: BookModel = deepFreeze({
  _id: 'tgg',
  title: 'The Great Gatsby',
});
