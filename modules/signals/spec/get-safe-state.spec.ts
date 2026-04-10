import { resource } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { patchState, signalStore, withLinkedState, withState } from '../src';
import { getState, oldPatchState } from '../src/state-source';

describe('safe patching', () => {
  const setup = () => {
    const Store = signalStore(
      { providedIn: 'root', protectedState: false },
      withState({ name: '' }),
      withLinkedState(() => {
        const { value } = resource({
          loader: (): Promise<number> => {
            throw new Error();
          },
        });

        return { value };
      })
    );

    return TestBed.inject(Store);
  };

  describe.each([
    { name: 'safe patching', patch: patchState, shouldThrow: false },
    { name: 'unsafe patching', patch: oldPatchState, shouldThrow: true },
  ])('$name', ({ patch, shouldThrow }) => {
    it('updates via an object literal', async () => {
      const store = setup();

      await new Promise((resolve) => setTimeout(resolve));
      const set = () => patch(store, { name: 'foo' });
      if (shouldThrow) {
        expect(set).toThrow();
      } else {
        expect(set).not.toThrow();
      }
    });

    it('updates via an updater function', async () => {
      const store = setup();

      await new Promise((resolve) => setTimeout(resolve));
      const set = () =>
        patch(store, (state) => ({ name: state.name.toUpperCase() }));
      if (shouldThrow) {
        expect(set).toThrow();
      } else {
        expect(set).not.toThrow();
      }
    });
  });

  it('throws on getState', async () => {
    const store = setup();
    await new Promise((resolve) => setTimeout(resolve));

    expect(() => getState(store)).toThrow();
  });

  it('throws if patchState accesses error signal', async () => {
    const store = setup();
    await new Promise((resolve) => setTimeout(resolve));

    expect(() => patchState(store, ({ value }) => ({}))).toThrow();
  });

  it('throws if patching an erroreous state property', async () => {
    const store = setup();
    await new Promise((resolve) => setTimeout(resolve));
    expect(() => patchState(store, { value: undefined })).toThrow();
  });
});
