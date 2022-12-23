import {
  getSelectors,
  RouterReducerState,
  DEFAULT_ROUTER_FEATURENAME,
  createRouterSelector,
} from '@ngrx/router-store';
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

      selectors = getSelectors();
    });

    it('should create selectCurrentRoute selector for selecting the current route', () => {
      const result = selectors.selectCurrentRoute(state);

      expect(result).toEqual(state.router.state.root.firstChild.firstChild);
    });

    it('should be able to overwrite default router feature state name', () => {
      const stateOverwrite = {
        anotherRouterKey: mockData,
      };
      const selectorOverwrite = getSelectors(
        (state: typeof stateOverwrite) => state.anotherRouterKey
      );

      const result = selectorOverwrite.selectCurrentRoute(stateOverwrite);
      expect(result).toEqual(
        stateOverwrite.anotherRouterKey.state.root.firstChild.firstChild
      );
    });

    it('should be able to use DEFAULT_ROUTER_FEATURENAME and createRouterSelector to select router feature state', () => {
      const stateOverwrite = {
        [DEFAULT_ROUTER_FEATURENAME]: mockData,
      };
      const selectorOverwrite = getSelectors(createRouterSelector());

      const result = selectorOverwrite.selectCurrentRoute(stateOverwrite);
      expect(result).toEqual(
        stateOverwrite[DEFAULT_ROUTER_FEATURENAME].state.root.firstChild
          .firstChild
      );
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

    it('should create a selector for selecting a specific route data param', () => {
      const result = selectors.selectRouteDataParam('testData')(state);

      expect(result).toEqual(
        state.router.state.root.firstChild.firstChild.data.testData
      );
    });

    it('should create a selector for selecting the url', () => {
      const result = selectors.selectUrl(state);

      expect(result).toEqual(state.router.state.url);
    });

    describe('selectTitle', () => {
      it('should return undefined when route is not defined', () => {
        const title = selectors.selectTitle({
          router: { state: { root: null }, navigationId: 1 },
        });

        expect(title).toBe(undefined);
      });

      it('should return undefined when route config is not defined', () => {
        const title = selectors.selectTitle({
          router: {
            state: { root: { routeConfig: null } },
            navigationId: 1,
          },
        });

        expect(title).toBe(undefined);
      });

      it('should return undefined when title is not defined', () => {
        const title = selectors.selectTitle({
          router: {
            state: { root: { routeConfig: {} } },
            navigationId: 1,
          },
        });

        expect(title).toBe(undefined);
      });

      it('should return static title', () => {
        const staticTitle = 'Static Title';
        const title = selectors.selectTitle({
          router: {
            state: { root: { routeConfig: { title: staticTitle } } },
            navigationId: 1,
          },
        });

        expect(title).toBe(staticTitle);
      });

      it('should return resolved title', () => {
        const resolvedTitle = 'Resolved Title';
        const title = selectors.selectTitle({
          router: {
            state: {
              root: {
                routeConfig: { title: class TitleResolver {} },
                title: resolvedTitle,
              },
            },
            navigationId: 1,
          },
        });

        expect(title).toBe(resolvedTitle);
      });
    });
  });
});
