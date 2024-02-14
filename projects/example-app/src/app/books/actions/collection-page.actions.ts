import { createActionGroup, emptyProps } from '@ngrx/store';

export const CollectionPageActions = createActionGroup({
  source: 'Collection Page',
  events: {
    /**
     * Load Collection Action
     */
    Enter: emptyProps(),
  },
});
