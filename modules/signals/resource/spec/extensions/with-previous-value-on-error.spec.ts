import { ERROR_EXTENSION_TYPE, withPreviousValueOnError } from '../../src';
import { createTestResource } from '../helpers';

describe('withPreviousValueOnError', () => {
  it('uses the shared error extension type', () => {
    expect(withPreviousValueOnError().type).toBe(ERROR_EXTENSION_TYPE);
  });

  it('delegates value and status to the resource outside the error state', async () => {
    const { resource, initLoading, resolveWithValue } =
      createTestResource<number[]>();
    withPreviousValueOnError().apply(resource);

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

  it('returns the last resolved value in the error state', async () => {
    const {
      resource,
      initLoading,
      updateParam,
      resolveWithValue,
      rejectWithError,
    } = createTestResource<number[]>();
    withPreviousValueOnError().apply(resource);

    initLoading();
    await resolveWithValue([1, 2, 3]);
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    updateParam();
    expect(resource.status()).toBe('loading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toBeUndefined();
    expect(resource.hasValue()).toBe(false);

    const error = new Error('failed');
    await rejectWithError(error);

    expect(resource.status()).toBe('error');
    expect(resource.isLoading()).toBe(false);
    expect(resource.error()).toBe(error);
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);
  });

  it('returns undefined in the error state when there is no previous value', async () => {
    const { resource, initLoading, rejectWithError } =
      createTestResource<number[]>();
    withPreviousValueOnError().apply(resource);

    initLoading();
    const error = new Error('failed');
    await rejectWithError(error);

    expect(resource.status()).toBe('error');
    expect(resource.error()).toBe(error);
    expect(resource.value()).toBeUndefined();
    expect(resource.hasValue()).toBe(false);
  });

  it('recovers and clears the error when a later reload succeeds', async () => {
    const { resource, initLoading, reload, resolveWithValue, rejectWithError } =
      createTestResource<number[]>();
    withPreviousValueOnError().apply(resource);

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

    const error = new Error('failed');
    await rejectWithError(error);
    expect(resource.status()).toBe('error');
    expect(resource.error()).toBe(error);
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);

    reload();
    await resolveWithValue([4, 5]);

    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toEqual([4, 5]);
    expect(resource.hasValue()).toBe(true);
  });
});
