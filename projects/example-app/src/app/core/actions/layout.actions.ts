import { createActionGroup, emptyProps } from '@ngrx/store';

export const LayoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Open Sidenav': emptyProps(),
    'Close Sidenav': emptyProps(),
  },
});
