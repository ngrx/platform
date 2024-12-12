import { signal } from '@angular/core';
import { withComputed, withMethods, withState } from '../src';
import { getInitialInnerStore } from '../src/signal-store';

describe('withComputed', () => {
  it('adds computed signals to the store immutably', () => {
    const initialStore = getInitialInnerStore();

    const s1 = signal('s1').asReadonly();
    const s2 = signal(10).asReadonly();

    const store = withComputed(() => ({ s1, s2 }))(initialStore);

    expect(Object.keys(store.props)).toEqual(['s1', 's2']);
    expect(Object.keys(initialStore.props)).toEqual([]);

    expect(store.props.s1).toBe(s1);
    expect(store.props.s2).toBe(s2);
  });

  it('logs warning if previously defined signal store members have the same name', () => {
    const initialStore = [
      withState({
        p1: 10,
        p2: 'p2',
      }),
      withComputed(() => ({
        s1: signal('s1').asReadonly(),
        s2: signal({ s: 2 }).asReadonly(),
      })),
      withMethods(() => ({
        m1() {},
        m2() {},
      })),
    ].reduce((acc, feature) => feature(acc), getInitialInnerStore());
    const s2 = signal(10).asReadonly();
    vi.spyOn(console, 'warn').mockImplementation();

    withComputed(() => ({
      p: signal(0).asReadonly(),
      p1: signal('p1').asReadonly(),
      s2,
      m1: signal({ m: 1 }).asReadonly(),
      m3: signal({ m: 3 }).asReadonly(),
      s3: signal({ s: 3 }).asReadonly(),
    }))(initialStore);

    expect(console.warn).toHaveBeenCalledWith(
      '@ngrx/signals: SignalStore members cannot be overridden.',
      'Trying to override:',
      'p1, s2, m1'
    );
  });
});
