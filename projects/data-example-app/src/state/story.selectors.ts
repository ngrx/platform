import { createSelector } from '@ngrx/store';
import { Stories, Story } from './story';

export const selectStories = createSelector<Story[], [Story[]], Story[][]>(
  (stories: Stories) => stories,
  (stories) =>
    stories.reduce<Stories[]>(
      (prev, cur) => {
        prev[cur.column].push(cur);

        prev[cur.column].sort((a, b) => a.order - b.order);

        return prev;
      },
      [[], [], [], []]
    )
);
