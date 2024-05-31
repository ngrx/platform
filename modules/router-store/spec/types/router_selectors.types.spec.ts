import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('getRouterSelectors', () => {
  const expectSnippet = expecter(
    (code) => `
      import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
      import { createSelector, createFeatureSelector } from '@ngrx/store';

      export interface State {
        router: RouterReducerState<any>;
      }

      export const selectRouter = createFeatureSelector<
        State,
        RouterReducerState<any>
      >('router');

      export const {
        selectCurrentRoute,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
        selectTitle,
      } = getRouterSelectors(selectRouter);

      ${code}
    `,
    compilerOptions()
  );

  it('selectCurrentRoute should return any', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectCurrentRoute,
        route => route
      );
    `).toInfer('selector', 'MemoizedSelector<State, any, (s1: any) => any>');
  });

  it('selectQueryParams should return Params', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectQueryParams,
        params => params
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, Params, (s1: Params) => Params>'
    );
  });

  it('selectQueryParam should return string or string[]', () => {
    expectSnippet(`
      export const selectIdFromRoute = selectQueryParam('id')
      export const selector = createSelector(
        selectIdFromRoute,
        id => id
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string | string[], (s1: string | string[]) => string | string[]>'
    );
  });

  it('selectRouteParams should return Params', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectRouteParams,
        params => params
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, Params, (s1: Params) => Params>'
    );
  });

  it('selectRouteParam should return string', () => {
    expectSnippet(`
      export const selectIdFromRoute = selectRouteParam('id')
      export const selector = createSelector(
        selectIdFromRoute,
        id => id
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string, (s1: string) => string>'
    );
  });

  it('selectRouteData should return Data', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectRouteData,
        data => data
      );
    `).toInfer('selector', 'MemoizedSelector<State, Data, (s1: Data) => Data>');
  });

  it('selectUrl should return string', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectUrl,
        url => url
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string, (s1: string) => string>'
    );
  });

  it('selectTitle should return string', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectTitle,
        url => url
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string, (s1: string) => string>'
    );
  });
});

describe('RouterStateSelectors', () => {
  const expectSnippet = expecter(
    (code) => `
      import { Selector } from '@ngrx/store';
      import { RouterStateSelectors } from './modules/router-store/src/models';

      ${code}
    `,
    compilerOptions()
  );

  it('is compatible with a dictionary of selectors', () => {
    expectSnippet(`
      type SelectorsDictionary = Record<
        string,
        | Selector<Record<string, any>, unknown>
        | ((...args: any[]) => Selector<Record<string, any>, unknown>)
      >;
      type ExtendsSelectorsDictionary<T> = T extends SelectorsDictionary
        ? true
        : false;

      let result: ExtendsSelectorsDictionary<
        RouterStateSelectors<Record<string, any>>
      >;
    `).toInfer('result', 'true');
  });
});
