import { createActionGroup, emptyProps } from '@ngrx/store';

export const layoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Open Sidenav': emptyProps(),
    'Close Sidenav': emptyProps(),
  },
});
