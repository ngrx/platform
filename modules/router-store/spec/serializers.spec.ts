import { RouterStateSnapshot } from '@angular/router';
import {
  DefaultRouterStateSerializer,
  MinimalRouterStateSerializer,
} from '../src';

describe('default serializer', () => {
  it('should serialize all properties', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = createRouteSnapshot();
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: createExpectedSnapshot(),
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize with an empty routeConfig', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = { ...createRouteSnapshot(), routeConfig: null };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        routeConfig: null,
        component: undefined,
      },
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize children', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = {
      ...createRouteSnapshot(),
      children: [createRouteSnapshot('child')],
    };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);

    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        firstChild: createExpectedSnapshot('child'),
        children: [createExpectedSnapshot('child')],
      },
    };

    expect(actual).toEqual(expected);
  });

  function createExpectedSnapshot(prefix = 'root') {
    return {
      ...createRouteSnapshot(prefix),
      component: `${prefix}-route.routeConfig.component`,
      root: undefined,
      parent: undefined,
      firstChild: undefined,
      pathFromRoot: undefined,
    };
  }
});

describe('minimal serializer', () => {
  it('should serialize only the minimal properties', () => {
    const serializer = new MinimalRouterStateSerializer();
    const snapshot = createRouteSnapshot();
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: createExpectedSnapshot(),
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize with an empty routeConfig', () => {
    const serializer = new MinimalRouterStateSerializer();
    const snapshot = { ...createRouteSnapshot(), routeConfig: null };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        routeConfig: null,
      },
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize children', () => {
    const serializer = new MinimalRouterStateSerializer();
    const snapshot = {
      ...createRouteSnapshot(),
      children: [createRouteSnapshot('child')],
    };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);

    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        firstChild: createExpectedSnapshot('child'),
        children: [createExpectedSnapshot('child')],
      },
    };

    expect(actual).toEqual(expected);
  });

  function createExpectedSnapshot(prefix = 'root') {
    const snapshot = {
      ...createRouteSnapshot(prefix),
      routeConfig: {
        // config doesn't have a component because it isn't serializable
        path: `${prefix}-route.routeConfig.path`,
        pathMatch: `${prefix}-route.routeConfig.pathMatch`,
        redirectTo: `${prefix}-route.routeConfig.redirectTo`,
        outlet: `${prefix}-route.routeConfig.outlet`,
      },
      firstChild: undefined,
    };

    // properties that aren't serializable
    delete snapshot.paramMap;
    delete snapshot.queryParamMap;
    delete snapshot.component;

    // properties that do not exist on the minimal serializer
    delete snapshot.root;
    delete snapshot.parent;
    delete snapshot.pathFromRoot;

    return snapshot;
  }
});

function createRouteSnapshot(prefix = 'root'): any {
  return {
    params: `${prefix}-route.params`,
    paramMap: `${prefix}-route.paramMap`,
    data: `${prefix}-route.data`,
    url: `${prefix}-route.url`,
    outlet: `${prefix}-route.outlet`,
    routeConfig: {
      component: `${prefix}-route.routeConfig.component`,
      path: `${prefix}-route.routeConfig.path`,
      pathMatch: `${prefix}-route.routeConfig.pathMatch`,
      redirectTo: `${prefix}-route.routeConfig.redirectTo`,
      outlet: `${prefix}-route.routeConfig.outlet`,
    },
    queryParams: `${prefix}-route.queryParams`,
    queryParamMap: `${prefix}-route.queryParamMap`,
    fragment: `${prefix}-route.fragment`,
    root: `${prefix}-route.root`,
    parent: `${prefix}-route.parent`,
    pathFromRoot: `${prefix}-route.params`,
    firstChild: null,
    children: [],
  };
}
