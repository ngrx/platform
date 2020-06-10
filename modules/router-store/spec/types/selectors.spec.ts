import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('router selectors', () => {
  const expectSnippet = expecter(
    (code) => `
      import * as fromRouter from '@ngrx/router-store';
      import { createSelector, createFeatureSelector } from '@ngrx/store';

      export interface State {
        router: fromRouter.RouterReducerState<any>;
      }

      export const selectRouter = createFeatureSelector<
        State,
        fromRouter.RouterReducerState<any>
      >('router');

      export const {
        selectCurrentRoute,
        selectQueryParams,
        selectQueryParam,
        selectRouteParams,
        selectRouteParam,
        selectRouteData,
        selectUrl,
      } = fromRouter.getSelectors(selectRouter);

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
    `).toInfer(
      'selector',
      'MemoizedSelector<State, any, DefaultProjectorFn<any>>'
    );
  });

  it('selectQueryParams should return Params', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectQueryParams,
        params => params
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, Params, DefaultProjectorFn<Params>>'
    );
  });

  it('selectQueryParam should return string', () => {
    expectSnippet(`
      export const selectIdFromRoute = selectQueryParam('id')
      export const selector = createSelector(
        selectIdFromRoute,
        id => id
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string, DefaultProjectorFn<string>>'
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
      'MemoizedSelector<State, Params, DefaultProjectorFn<Params>>'
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
      'MemoizedSelector<State, string, DefaultProjectorFn<string>>'
    );
  });

  it('selectRouteData should return Data', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectRouteData,
        data => data
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, Data, DefaultProjectorFn<Data>>'
    );
  });

  it('selectUrl should return string', () => {
    expectSnippet(`
      export const selector = createSelector(
        selectUrl,
        url => url
      );
    `).toInfer(
      'selector',
      'MemoizedSelector<State, string, DefaultProjectorFn<string>>'
    );
  });
});
