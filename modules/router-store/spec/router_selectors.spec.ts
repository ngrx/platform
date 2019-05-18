import * as fromRouter from '@ngrx/router-store';
import { RouterStateSelectors } from '../src/models';
import { getSelectors } from '../src/router_selectors';

let mockData = {
  state: {
    root: {
      params: {},
      paramMap: {
        params: {},
      },
      data: {},
      url: [],
      outlet: 'primary',
      routeConfig: null,
      queryParams: {},
      queryParamMap: {
        params: {},
      },
      fragment: null,
      firstChild: {
        params: {},
        paramMap: {
          params: {},
        },
        data: {},
        url: [
          {
            path: 'login',
            parameters: {},
          },
        ],
        outlet: 'primary',
        routeConfig: {
          path: 'login',
        },
        queryParams: {},
        queryParamMap: {
          params: {},
        },
        fragment: null,
        children: [],
      },
      children: [
        {
          params: {},
          paramMap: {
            params: {},
          },
          data: {},
          url: [
            {
              path: 'login',
              parameters: {},
            },
          ],
          outlet: 'primary',
          routeConfig: {
            path: 'login',
          },
          queryParams: {},
          queryParamMap: {
            params: {},
          },
          fragment: null,
          children: [],
        },
      ],
    },
    url: '/login',
  },
  navigationId: 1,
};
describe('Router State Selectors', () => {
  describe('Composed Selectors', () => {
    interface State {
      router: fromRouter.RouterReducerState<any>;
    }

    let selectors: RouterStateSelectors<any, State>;
    let state: State;

    beforeEach(() => {
      state = {
        router: mockData,
      };

      selectors = getSelectors((state: State) => state.router);
    });

    it('should create a selector for selecting the url', () => {
      const url = selectors.selectUrl(state);

      expect(url).toEqual(state.router.state.url);
    });
  });
});
