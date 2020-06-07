import { cold, hot } from 'jasmine-marbles';
import { mergeMap, take, switchMap } from 'rxjs/operators';
import { createAction, Action } from '@ngrx/store';
import { act } from '@ngrx/effects';
import { throwError, Subject } from 'rxjs';

describe('act operator', () => {
  /**
   * Helper function that converts a string (or array of letters) into the
   * object, each property of which is a letter that is assigned an Action
   * with type as that letter.
   *
   * e.g. genActions('abc') would result in
   * {
   *   'a': {type: 'a'},
   *   'b': {type: 'b'},
   *   'c': {type: 'c'},
   * }
   */
  function genActions(marbles: string): { [marble: string]: Action } {
    return marbles.split('').reduce((acc, marble) => {
      return {
        ...acc,
        [marble]: createAction(marble)(),
      };
    }, {} as { [marble: string]: Action });
  }

  it('should call project functon', () => {
    const sources$ = hot('-a-b', genActions('ab'));

    const actual$ = new Subject();
    const project = jasmine
      .createSpy('project')
      .and.callFake((...args: [Action, number]) => {
        actual$.next(args);
        return cold('(v|)', genActions('v'));
      });
    const error = () => createAction('e')();

    sources$.pipe(act(project, error)).subscribe();

    expect(actual$).toBeObservable(
      cold('              -a-b', {
        a: [createAction('a')(), 0],
        b: [createAction('b')(), 1],
      })
    );
  });

  it('should emit output action', () => {
    const sources$ = hot('  -a', genActions('a'));
    const project = () => cold('(v|)', genActions('v'));
    const error = () => createAction('e')();
    const expected$ = cold('-v', genActions('v'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should take any type of Observable as an Input', () => {
    const sources$ = hot('  -a', { a: 'a string' });
    const project = () => cold('(v|)', genActions('v'));
    const error = () => createAction('e')();
    const expected$ = cold('-v', genActions('v'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should emit output action with config passed', () => {
    const sources$ = hot('  -a', genActions('a'));
    // Completes
    const project = () => cold('(v|)', genActions('v'));
    const error = () => createAction('e')();
    // offset by source delay and doesn't complete
    const expected$ = cold('-v--', genActions('v'));

    const output$ = sources$.pipe(act({ project, error }));

    expect(output$).toBeObservable(expected$);
  });

  it('should call the error callback when error in the project occurs', () => {
    const sources$ = hot('  -a', genActions('a'));
    const project = () => throwError('error');
    const error = () => createAction('e')();
    const expected$ = cold('-e', genActions('e'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should continue listen to the sources actions after error occurs', () => {
    const sources$ = hot('-a--b', genActions('ab'));
    const project = (action: Action) =>
      action.type === 'a' ? throwError('error') : cold('(v|)', genActions('v'));
    const error = () => createAction('e')();
    // error handler action is dispatched and next action with type b is also
    // handled
    const expected$ = cold('-e--v', genActions('ev'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should emit multiple output actions when project produces many actions', () => {
    const sources$ = hot('  -a', genActions('a'));
    const project = () => cold('v-w-x-(y|)', genActions('vwxy'));
    const error = () => createAction('e')();
    // offset by source delay and doesn't complete
    const expected$ = cold('-v-w-x-y--', genActions('vwxy'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should emit multiple output actions when project produces many actions with config passed', () => {
    const sources$ = hot('  -a', genActions('a'));
    const project = () => cold('v-w-x-(y|)', genActions('vwxy'));
    const error = () => createAction('e')();
    // offset by source delay
    const expected$ = cold('-v-w-x-y', genActions('vwxy'));

    const output$ = sources$.pipe(act({ project, error }));

    expect(output$).toBeObservable(expected$);
  });

  it('should emit multiple output actions when source produces many actions', () => {
    const sources$ = hot('  -a--b', genActions('ab'));
    const project = () => cold('(v|)', genActions('v'));
    const error = () => createAction('e')();

    const expected$ = cold('-v--v-', genActions('v'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should emit multiple output actions when source produces many actions with config passed', () => {
    const sources$ = hot('  -a--b', genActions('ab'));
    const project = () => cold('(v|)', genActions('v'));
    const error = () => createAction('e')();

    const expected$ = cold('-v--v-', genActions('v'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should flatten projects with concatMap by default', () => {
    const sources$ = hot('  -a--b', genActions('ab'));
    const project = () => cold('v------(w|)', genActions('vw'));
    const error = () => createAction('e')();

    // Even thought source produced actions one right after another, operator
    // wait for the project to complete before handling second source action.
    const expected$ = cold('-v------(wv)---w', genActions('vw'));

    const output$ = sources$.pipe(act(project, error));

    expect(output$).toBeObservable(expected$);
  });

  it('should flatten projects with concatMap by default with config passed', () => {
    const sources$ = hot('  -a--b', genActions('ab'));
    const project = () => cold('v------(w|)', genActions('vw'));
    const error = () => createAction('e')();

    // Even thought source produced actions one right after another, operator
    // wait for the project to complete before handling second source action.
    const expected$ = cold('-v------(wv)---w', genActions('vw'));

    const output$ = sources$.pipe(act({ project, error }));

    expect(output$).toBeObservable(expected$);
  });

  it('should use provided flattening operator', () => {
    const sources$ = hot('  -a--b', genActions('ab'));
    const project = () => cold('v------(w|)', genActions('vw'));
    const error = () => createAction('e')();

    // Merge map starts project streams in parallel
    const expected$ = cold('-v--v---w--w', genActions('vw'));

    const output$ = sources$.pipe(act({ project, error, operator: mergeMap }));

    expect(output$).toBeObservable(expected$);
  });

  it('should use provided complete callback', () => {
    const sources$ = hot('  -a', genActions('a'));
    const project = () => cold('v-|', genActions('v'));
    const error = () => createAction('e')();
    const complete = () => createAction('c')();

    // Completed is the last action
    const expected$ = cold('-v-c', genActions('vc'));

    const output$ = sources$.pipe(act({ project, error, complete }));

    expect(output$).toBeObservable(expected$);
  });

  it('should pass number of observables that project emitted and input action to complete callback', () => {
    const sources$ = hot('-a', genActions('a'));
    const project = () => cold('v-w-|', genActions('v'));
    const error = () => createAction('e')();

    const actual$ = new Subject();

    const complete = jasmine
      .createSpy('complete')
      .and.callFake((...args: [number, Action]) => {
        actual$.next(args);
        return createAction('c')();
      });

    sources$.pipe(act({ project, error, complete })).subscribe();

    expect(actual$).toBeObservable(
      cold('-----a', {
        a: [2, createAction('a')()],
      })
    );
  });

  it('should use provided unsubscribe callback', () => {
    const sources$ = hot('  -a-b', genActions('ab'));
    const project = () => cold('v-----w|', genActions('vw'));
    const error = () => createAction('e')();
    const unsubscribe = () => createAction('u')();

    // switchMap causes unsubscription
    const expected$ = cold('-v-(uv)--w', genActions('vuw'));

    const output$ = sources$.pipe(
      act({ project, error, unsubscribe, operator: switchMap })
    );

    expect(output$).toBeObservable(expected$);
  });

  it(
    'should pass number of observables that project emitted before' +
      ' unsubscribing and prior input action to unsubsubscribe callback',
    () => {
      const sources$ = hot('-a-b', genActions('ab'));
      const project = () => cold('vw----v|', genActions('vw'));
      const error = () => createAction('e')();

      const actual$ = new Subject();

      const unsubscribe = jasmine
        .createSpy('unsubscribe')
        .and.callFake((...args: [number, Action]) => {
          actual$.next(args);
          return createAction('u')();
        });

      sources$
        .pipe(act({ project, error, unsubscribe, operator: switchMap }))
        .subscribe();

      expect(actual$).toBeObservable(
        cold('---a', {
          a: [2, createAction('a')()],
        })
      );
    }
  );
});
