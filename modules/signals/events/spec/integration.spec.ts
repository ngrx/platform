import { computed, inject, Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  delay,
  exhaustMap,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import {
  getState,
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withState,
} from '@ngrx/signals';
import {
  EntityState,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import {
  Dispatcher,
  event,
  eventGroup,
  Events,
  injectDispatch,
  on,
  withEffects,
  withReducer,
} from '../src';

describe('Integration Tests', () => {
  type Book = { id: number; title: string };

  const book1: Book = { id: 1, title: 'Book 1' };
  const book2: Book = { id: 2, title: 'Book 2' };
  const book3: Book = { id: 3, title: 'Book 3' };

  @Injectable({ providedIn: 'root' })
  class BooksService {
    getAll(): Observable<Book[]> {
      return of([]);
    }

    getByQuery(_query: string): Observable<Book[]> {
      return of([]);
    }
  }

  const booksApiEvents = eventGroup({
    source: 'Books API',
    events: {
      loadedSuccess: type<Book[]>(),
      loadedFailure: type<string>(),
    },
  });

  type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };

  type RequestStatusState = { requestStatus: RequestStatus };

  function withRequestStatus() {
    return signalStoreFeature(
      withState<RequestStatusState>({ requestStatus: 'idle' }),
      withComputed(({ requestStatus }) => ({
        isPending: computed(() => requestStatus() === 'pending'),
        isFulfilled: computed(() => requestStatus() === 'fulfilled'),
        error: computed(() => {
          const status = requestStatus();
          return typeof status === 'object' ? status.error : null;
        }),
      }))
    );
  }

  function setPending(): RequestStatusState {
    return { requestStatus: 'pending' };
  }

  function setFulfilled(): RequestStatusState {
    return { requestStatus: 'fulfilled' };
  }

  function setError(error: string): RequestStatusState {
    return { requestStatus: { error } };
  }

  describe('withReducer and withEffects', () => {
    const booksPageEvents = eventGroup({
      source: 'Books Page',
      events: {
        opened: type<void>(),
        refreshed: type<void>(),
      },
    });

    const BooksStore = signalStore(
      { providedIn: 'root' },
      withEntities<Book>(),
      withRequestStatus(),
      withReducer(
        on(booksPageEvents.opened, booksPageEvents.refreshed, setPending),
        on(booksApiEvents.loadedSuccess, ({ payload }) => [
          setAllEntities(payload),
          setFulfilled(),
        ]),
        on(booksApiEvents.loadedFailure, ({ payload }) => setError(payload))
      ),
      withEffects(
        (_, events = inject(Events), booksService = inject(BooksService)) => ({
          loadUsers$: events
            .on(booksPageEvents.opened, booksPageEvents.refreshed)
            .pipe(
              exhaustMap(() =>
                booksService.getAll().pipe(
                  mapResponse({
                    next: (books) => booksApiEvents.loadedSuccess(books),
                    error: (error: { message: string }) =>
                      booksApiEvents.loadedFailure(error.message),
                  })
                )
              )
            ),
          logError$: events
            .on(booksApiEvents.loadedFailure)
            .pipe(tap(({ payload }) => console.error(payload))),
        })
      )
    );

    it('loads entities when opened and refreshed events are dispatched', fakeAsync(() => {
      const booksService = TestBed.inject(BooksService);
      const booksStore = TestBed.inject(BooksStore);
      const dispatch = TestBed.runInInjectionContext(() =>
        injectDispatch(booksPageEvents)
      );

      expect(getState(booksStore)).toEqual({
        ids: [],
        entityMap: {},
        requestStatus: 'idle',
      });

      vitest
        .spyOn(booksService, 'getAll')
        .mockImplementation(() => of([book1, book2]).pipe(delay(500)));
      dispatch.opened();

      expect(getState(booksStore)).toEqual({
        ids: [],
        entityMap: {},
        requestStatus: 'pending',
      });

      tick(500);

      expect(getState(booksStore)).toEqual({
        ids: [book1.id, book2.id],
        entityMap: {
          [book1.id]: book1,
          [book2.id]: book2,
        },
        requestStatus: 'fulfilled',
      });

      vitest
        .spyOn(booksService, 'getAll')
        .mockImplementation(() => of([book1, book2, book3]).pipe(delay(1_000)));
      dispatch.refreshed();

      expect(getState(booksStore)).toEqual({
        ids: [book1.id, book2.id],
        entityMap: {
          [book1.id]: book1,
          [book2.id]: book2,
        },
        requestStatus: 'pending',
      });

      tick(1_000);

      expect(getState(booksStore)).toEqual({
        ids: [book1.id, book2.id, book3.id],
        entityMap: {
          [book1.id]: book1,
          [book2.id]: book2,
          [book3.id]: book3,
        },
        requestStatus: 'fulfilled',
      });
    }));

    it('logs an error when load entities fail', fakeAsync(() => {
      const booksService = TestBed.inject(BooksService);
      const booksStore = TestBed.inject(BooksStore);
      const dispatch = TestBed.runInInjectionContext(() =>
        injectDispatch(booksPageEvents)
      );

      expect(getState(booksStore)).toEqual({
        ids: [],
        entityMap: {},
        requestStatus: 'idle',
      });

      vitest
        .spyOn(booksService, 'getAll')
        .mockImplementation(() =>
          timer(500).pipe(mergeMap(() => throwError(() => new Error('Error!'))))
        );
      dispatch.opened();

      expect(getState(booksStore)).toEqual({
        ids: [],
        entityMap: {},
        requestStatus: 'pending',
      });

      vitest.spyOn(console, 'error').mockImplementation(() => {});
      tick(500);

      expect(getState(booksStore)).toEqual({
        ids: [],
        entityMap: {},
        requestStatus: { error: 'Error!' },
      });
      expect(console.error).toHaveBeenCalledWith('Error!');
    }));

    it('handles events in the order they are dispatched', () => {
      const first = event('first');
      const second = event('second');
      const save = event('save', type<string>());
      const Store = signalStore(
        { providedIn: 'root' },
        withState({ savedEvents: [] as string[] }),
        withReducer(
          on(save, ({ payload }, state) => ({
            savedEvents: [...state.savedEvents, payload],
          }))
        ),
        withEffects((_, events = inject(Events)) => ({
          emitSecond$: events.on(first).pipe(map(() => second())),
          save$: events.on(first, second).pipe(map(({ type }) => save(type))),
        }))
      );

      const dispatcher = TestBed.inject(Dispatcher);
      const store = TestBed.inject(Store);

      dispatcher.dispatch(first());
      expect(store.savedEvents()).toEqual(['first', 'second']);
    });
  });

  describe('custom withReducer and withEffects', () => {
    const booksPageEvents = eventGroup({
      source: 'Books Page',
      events: {
        queryChanged: type<string>(),
        refreshed: type<void>(),
      },
    });

    type QueryState = { query: string };

    function withBooksReducer() {
      return signalStoreFeature(
        { state: type<QueryState & EntityState<Book> & RequestStatusState>() },
        withReducer(
          on(booksPageEvents.queryChanged, ({ payload: query }) => ({ query })),
          on(
            booksPageEvents.queryChanged,
            booksPageEvents.refreshed,
            setPending
          ),
          on(booksApiEvents.loadedSuccess, ({ payload }) => [
            setAllEntities(payload),
            setFulfilled(),
          ]),
          on(booksApiEvents.loadedFailure, ({ payload }) => setError(payload))
        )
      );
    }

    function withBooksEffects() {
      return signalStoreFeature(
        { state: type<QueryState>() },
        withEffects(
          (
            { query },
            events = inject(Events),
            booksService = inject(BooksService)
          ) => ({
            loadUsers$: events
              .on(booksPageEvents.queryChanged, booksPageEvents.refreshed)
              .pipe(
                exhaustMap(() =>
                  booksService.getByQuery(query()).pipe(
                    mapResponse({
                      next: (books) => booksApiEvents.loadedSuccess(books),
                      error: (error: { message: string }) =>
                        booksApiEvents.loadedFailure(error.message),
                    })
                  )
                )
              ),
            logError$: events
              .on(booksApiEvents.loadedFailure)
              .pipe(tap(({ payload }) => console.error(payload))),
          })
        )
      );
    }

    const BooksStore = signalStore(
      { providedIn: 'root' },
      withState<QueryState>({ query: '' }),
      withEntities<Book>(),
      withRequestStatus(),
      withBooksReducer(),
      withBooksEffects()
    );

    it('loads entities when queryChanged and refreshed events are dispatched', fakeAsync(() => {
      const booksService = TestBed.inject(BooksService);
      const booksStore = TestBed.inject(BooksStore);
      const dispatch = TestBed.runInInjectionContext(() =>
        injectDispatch(booksPageEvents)
      );

      expect(getState(booksStore)).toEqual({
        query: '',
        ids: [],
        entityMap: {},
        requestStatus: 'idle',
      });

      vitest
        .spyOn(booksService, 'getByQuery')
        .mockImplementation(() => of([book1]).pipe(delay(500)));
      dispatch.queryChanged('book');

      expect(getState(booksStore)).toEqual({
        query: 'book',
        ids: [],
        entityMap: {},
        requestStatus: 'pending',
      });

      tick(500);

      expect(getState(booksStore)).toEqual({
        query: 'book',
        ids: [book1.id],
        entityMap: { [book1.id]: book1 },
        requestStatus: 'fulfilled',
      });

      vitest
        .spyOn(booksService, 'getByQuery')
        .mockImplementation(() => of([book1, book2]).pipe(delay(1_000)));
      dispatch.refreshed();

      expect(getState(booksStore)).toEqual({
        query: 'book',
        ids: [book1.id],
        entityMap: { [book1.id]: book1 },
        requestStatus: 'pending',
      });

      tick(1_000);

      expect(getState(booksStore)).toEqual({
        query: 'book',
        ids: [book1.id, book2.id],
        entityMap: {
          [book1.id]: book1,
          [book2.id]: book2,
        },
        requestStatus: 'fulfilled',
      });
    }));

    it('logs an error when load entities fail', fakeAsync(() => {
      const booksService = TestBed.inject(BooksService);
      const booksStore = TestBed.inject(BooksStore);
      const dispatch = TestBed.runInInjectionContext(() =>
        injectDispatch(booksPageEvents)
      );

      expect(getState(booksStore)).toEqual({
        query: '',
        ids: [],
        entityMap: {},
        requestStatus: 'idle',
      });

      vitest
        .spyOn(booksService, 'getByQuery')
        .mockImplementation(() =>
          timer(500).pipe(mergeMap(() => throwError(() => new Error('Error!'))))
        );
      dispatch.queryChanged('search');

      expect(getState(booksStore)).toEqual({
        query: 'search',
        ids: [],
        entityMap: {},
        requestStatus: 'pending',
      });

      vitest.spyOn(console, 'error').mockImplementation(() => {});
      tick(500);

      expect(getState(booksStore)).toEqual({
        query: 'search',
        ids: [],
        entityMap: {},
        requestStatus: { error: 'Error!' },
      });
      expect(console.error).toHaveBeenCalledWith('Error!');
    }));
  });
});
