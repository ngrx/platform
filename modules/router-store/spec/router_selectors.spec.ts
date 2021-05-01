import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { RouterStateSelectors } from '../src/models';

const mockData = {
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
      queryParams: {
        ref: 'ngrx.io',
      },
      queryParamMap: {
        params: {
          ref: 'ngrx.io',
        },
      },
      fragment: 'test-fragment',
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
        queryParams: {
          ref: 'ngrx.io',
        },
        queryParamMap: {
          params: {
            ref: 'ngrx.io',
          },
        },
        firstChild: {
          params: {
            id: 'etyDDwAAQBAJ',
          },
          paramMap: {
            params: {
              id: 'etyDDwAAQBAJ',
            },
          },
          data: {
            testData: 'test-data',
          },
          url: [
            {
              path: 'etyDDwAAQBAJ',
              parameters: {},
            },
          ],
          outlet: 'primary',
          routeConfig: {
            path: ':id',
          },
          queryParams: {
            ref: 'ngrx.io',
          },
          queryParamMap: {
            params: {
              ref: 'ngrx.io',
            },
          },
          fragment: 'test-fragment',
          children: [],
        },
        fragment: 'test-fragment',
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
          queryParams: {
            ref: 'ngrx.io',
          },
          queryParamMap: {
            params: {
              ref: 'ngrx.io',
            },
          },
          fragment: 'test-fragment',
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
      router: RouterReducerState<any>;
    }

    let selectors: RouterStateSelectors<State>;
    let state: State;

    beforeEach(() => {
      state = {
        router: mockData,
      };

      selectors = getSelectors((state: State) => state.router);
    });

    it('should create selectCurrentRoute selector for selecting the current route', () => {
      const result = selectors.selectCurrentRoute(state);

      expect(result).toEqual(state.router.state.root.firstChild.firstChild);
    });

    it('should return undefined from selectCurrentRoute if routerState does not exist', () => {
      interface State {
        router: any;
      }
      const state: State = {
        router: undefined,
      };
      selectors = getSelectors((state: State) => state.router);

      const result = selectors.selectCurrentRoute(state);

      expect(result).toEqual(undefined);
    });

    it('should create a selector for selecting the fragment', () => {
      const result = selectors.selectFragment(state);

      expect(result).toEqual(state.router.state.root.fragment);
    });

    it('should create a selector for selecting the query params', () => {
      const result = selectors.selectQueryParams(state);

      expect(result).toEqual(state.router.state.root.queryParams);
    });

    it('should create a selector for selecting a specific query param', () => {
      const result = selectors.selectQueryParam('ref')(state);

      expect(result).toEqual(state.router.state.root.queryParams.ref);
    });

    it('should create a selector for selecting the route params', () => {
      const result = selectors.selectRouteParams(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.params
      );
    });

    it('should create a selector for selecting a specific route param', () => {
      const result = selectors.selectRouteParam('id')(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.params.id
      );
    });

    it('should create a selector for selecting the route data', () => {
      const result = selectors.selectRouteData(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.data
      );
    });

    it('should create a selector for selecting the url', () => {
      const result = selectors.selectUrl(state);

      expect(result).toEqual(state.router.state.url);
    });
  });
});
