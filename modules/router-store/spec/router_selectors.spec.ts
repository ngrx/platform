import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { RouterStateSelectors } from '../src/models';

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
        queryParams: {
          id: 3,
        },
        queryParamMap: {
          params: {},
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
          queryParams: {},
          queryParamMap: {
            params: {},
          },
          children: [],
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

    let selectors: RouterStateSelectors<any, State>;
    let state: State;

    beforeEach(() => {
      state = {
        router: mockData,
      };

      selectors = getSelectors((state: State) => state.router);
    });
    it('should create a selector for selecting the query params', () => {
      const result = selectors.selectQueryParams(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.queryParams
      );
    });
    it('should create a selector for selecting the route params', () => {
      const result = selectors.selectRouteParams(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.params
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
