import { createActionGroup, emptyProps } from '@ngrx/store';

export const collectionPageActions = createActionGroup({
  source: 'Collection Page',
  events: {
    /**
     * Load Collection Action
     */
    Enter: emptyProps(),
  },
});
