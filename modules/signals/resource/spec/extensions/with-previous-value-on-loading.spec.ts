import { LOADING_EXTENSION_TYPE, withPreviousValueOnLoading } from '../../src';
import { createTestResource } from '../helpers';

describe('withPreviousValueOnLoading', () => {
  it('uses the shared loading extension type', () => {
    expect(withPreviousValueOnLoading().type).toBe(LOADING_EXTENSION_TYPE);
  });

  it('returns undefined while loading without a previous value and the actual value once resolved', async () => {
    const { resource, initLoading, resolveWithValue } =
      createTestResource<number[]>();
    withPreviousValueOnLoading().apply(resource);

    expect(resource.status()).toBe('idle');

    initLoading();
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toBeUndefined();
    expect(resource.hasValue()).toBe(false);

    await resolveWithValue([1, 2, 3]);
    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);
  });

  it('keeps the last resolved value while reloading after a param change', async () => {
    const { resource, initLoading, updateParam, resolveWithValue } =
      createTestResource<number[]>();
    withPreviousValueOnLoading().apply(resource);

    initLoading();
    await resolveWithValue([1, 2, 3]);
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    updateParam();
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    await resolveWithValue([4, 5]);
    expect(resource.value()).toEqual([4, 5]);
    expect(resource.hasValue()).toBe(true);
  });

  it('keeps the last resolved value while reloading via resource.reload()', async () => {
    const { resource, initLoading, reload, resolveWithValue } =
      createTestResource<number[]>();
    withPreviousValueOnLoading().apply(resource);

    initLoading();
    await resolveWithValue([1, 2, 3]);
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    reload();
    expect(resource.status()).toBe('reloading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    await resolveWithValue([4, 5]);
    expect(resource.value()).toEqual([4, 5]);
    expect(resource.hasValue()).toBe(true);
  });

  it('does not swallow errors when the load fails', async () => {
    const { resource, initLoading, rejectWithError } =
      createTestResource<number[]>();
    withPreviousValueOnLoading().apply(resource);

    initLoading();
    const error = new Error('failed');
    await rejectWithError(error);

    expect(resource.status()).toBe('error');
    expect(resource.isLoading()).toBe(false);
    expect(resource.error()).toBe(error);
    expect(resource.hasValue()).toBe(false);
    expect(() => resource.value()).toThrow();
  });
});
