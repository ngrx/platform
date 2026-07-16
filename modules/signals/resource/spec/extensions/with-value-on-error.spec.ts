import { ERROR_EXTENSION_TYPE, withValueOnError } from '../../src';
import { createTestResource } from '../helpers';

describe('withValueOnError', () => {
  it('uses the shared error extension type', () => {
    expect(withValueOnError([]).type).toBe(ERROR_EXTENSION_TYPE);
  });

  it('delegates value and hasValue to the resource outside the error state', async () => {
    const { resource, initLoading, resolveWithValue } =
      createTestResource<number[]>();
    withValueOnError([]).apply(resource);

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

  it('replaces the value with the fallback in the error state', async () => {
    const {
      resource,
      initLoading,
      updateParam,
      resolveWithValue,
      rejectWithError,
    } = createTestResource<number[]>();
    withValueOnError([]).apply(resource);

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
    expect(resource.value()).toEqual([]);
    expect(resource.hasValue()).toBe(true);
  });

  it('reports no value through hasValue when the fallback is undefined', async () => {
    const { resource, initLoading, rejectWithError } =
      createTestResource<string>();
    withValueOnError(undefined).apply(resource);

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
    withValueOnError([]).apply(resource);

    initLoading();
    const error = new Error('failed');
    await rejectWithError(error);
    expect(resource.status()).toBe('error');
    expect(resource.error()).toBe(error);
    expect(resource.value()).toEqual([]);
    expect(resource.hasValue()).toBe(true);

    reload();
    expect(resource.status()).toBe('reloading');
    expect(resource.isLoading()).toBe(true);
    expect(resource.error()).toBe(error);
    expect(resource.value()).toBeUndefined();
    expect(resource.hasValue()).toBe(false);

    await resolveWithValue([1, 2, 3]);

    expect(resource.status()).toBe('resolved');
    expect(resource.isLoading()).toBe(false);
    expect(resource.error()).toBeUndefined();
    expect(resource.value()).toEqual([1, 2, 3]);
    expect(resource.hasValue()).toBe(true);
  });
});
