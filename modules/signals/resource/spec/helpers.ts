import { ApplicationRef, resource, ResourceRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

type Deferred<T> = {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export type TestResource<T> = {
  resource: ResourceRef<T | undefined>;
  initLoading: () => void;
  updateParam: () => void;
  reload: () => void;
  resolveWithValue: (value: T) => Promise<void>;
  rejectWithError: (error: Error) => Promise<void>;
};

export function createTestResource<T>(): TestResource<T> {
  const params = signal<number | undefined>(undefined);
  let pending: Deferred<T> | undefined = undefined;

  const resourceRef = TestBed.runInInjectionContext(() =>
    resource<T, number | undefined>({
      params,
      loader: () =>
        new Promise<T>((resolve, reject) => {
          pending = { resolve, reject };
        }),
    })
  );
  const appRef = TestBed.inject(ApplicationRef);

  async function emit(settle: (deferred: Deferred<T>) => void): Promise<void> {
    settle(pending as Deferred<T>);
    pending = undefined;
    await appRef.whenStable();
  }

  return {
    resource: resourceRef,
    initLoading: () => {
      params.set(0);
      TestBed.tick();
    },
    updateParam: () => {
      params.update((value) => (value ?? 0) + 1);
      TestBed.tick();
    },
    reload: () => {
      resourceRef.reload();
      TestBed.tick();
    },
    resolveWithValue: (value) => emit((deferred) => deferred.resolve(value)),
    rejectWithError: (error) => emit((deferred) => deferred.reject(error)),
  };
}
