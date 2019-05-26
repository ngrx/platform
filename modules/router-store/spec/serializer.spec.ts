import { RouterStateSnapshot } from '@angular/router';
import { DefaultRouterStateSerializer } from '../src';

describe('serializer', () => {
  it('should serialize all properties', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = createSnapshot();
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
    const snapshot = { ...createSnapshot(), routeConfig: null };
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
      ...createSnapshot(),
      children: [createSnapshot('child')],
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

  function createSnapshot(prefix = 'root'): any {
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

  function createExpectedSnapshot(prefix = 'root') {
    return {
      ...createSnapshot(prefix),
      component: `${prefix}-route.routeConfig.component`,
      root: undefined,
      parent: undefined,
      firstChild: undefined,
      pathFromRoot: undefined,
    };
  }
});
