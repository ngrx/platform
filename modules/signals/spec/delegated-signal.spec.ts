import { computed, isSignal, signal } from '@angular/core';
import { delegatedSignal } from '../src';

describe('delegatedSignal', () => {
  it('updates from source to delegated signal', () => {
    const query = signal('');
    const limit = signal(10);

    const delegated = delegatedSignal({
      source: () => ({ query: query(), limit: limit() }),
      update: ({ query: q, limit: l }) => {
        query.set(q);
        limit.set(l);
      },
    });

    expect(delegated()).toEqual({ query: '', limit: 10 });

    query.set('ngrx');
    expect(delegated()).toEqual({ query: 'ngrx', limit: 10 });

    limit.set(25);
    expect(delegated()).toEqual({ query: 'ngrx', limit: 25 });
  });

  it('updates from delegated signal to source', () => {
    const query = signal('');
    const limit = signal(10);

    const delegated = delegatedSignal({
      source: () => ({ query: query(), limit: limit() }),
      update: ({ query: q, limit: l }) => {
        query.set(q);
        limit.set(l);
      },
    });

    delegated.set({ query: 'ngrx', limit: 25 });
    expect(query()).toBe('ngrx');
    expect(limit()).toBe(25);

    delegated.update((current) => ({ ...current, query: 'signals' }));
    expect(query()).toBe('signals');
    expect(limit()).toBe(25);
  });

  it('asReadonly returns a readonly signal backed by the source computation', () => {
    const query = signal('');
    const limit = signal(10);

    const delegated = delegatedSignal({
      source: () => ({ query: query(), limit: limit() }),
      update: ({ query: q, limit: l }) => {
        query.set(q);
        limit.set(l);
      },
    });

    const readonly = delegated.asReadonly();
    expect(isSignal(readonly)).toBe(true);
    expect('set' in readonly).toBe(false);
    expect('update' in readonly).toBe(false);
    expect(readonly()).toEqual({ query: '', limit: 10 });

    query.set('ngrx');
    expect(readonly()).toEqual({ query: 'ngrx', limit: 10 });
  });

  it('uses the provided equality function', () => {
    const query = signal('');
    const limit = signal(10);
    let recomputeCount = 0;

    const delegated = delegatedSignal({
      source: () => ({ query: query(), limit: limit() }),
      update: ({ query: q, limit: l }) => {
        query.set(q);
        limit.set(l);
      },
      equal: (a, b) => a.query === b.query,
    });

    const downstream = computed(() => {
      recomputeCount++;
      return delegated();
    });

    downstream();
    expect(recomputeCount).toBe(1);

    limit.set(25);
    downstream();
    expect(recomputeCount).toBe(1);

    query.set('ngrx');
    downstream();
    expect(recomputeCount).toBe(2);
  });
});
