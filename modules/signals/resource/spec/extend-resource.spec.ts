import { Resource } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  extendResource,
  LOADING_EXTENSION_TYPE,
  provideResourceExtensions,
  ResourceExtension,
  withPreviousValueOnLoading,
  withValueOnError,
  withValueOnLoading,
} from '../src';
import { createTestResource } from './helpers';

describe('extendResource', () => {
  it('returns the same resource instance', () => {
    const { resource } = createTestResource<number>();

    const extended = TestBed.runInInjectionContext(() =>
      extendResource(resource)
    );

    expect(extended).toBe(resource);
  });

  it('applies globally provided extensions before passed ones', () => {
    const applied: string[] = [];
    const track = (label: string): ResourceExtension<Resource<unknown>> => ({
      type: Symbol(label),
      apply: () => applied.push(label),
    });
    TestBed.configureTestingModule({
      providers: [provideResourceExtensions(track('global'))],
    });
    const { resource } = createTestResource<number>();

    TestBed.runInInjectionContext(() =>
      extendResource(resource, track('passed'))
    );

    expect(applied).toEqual(['global', 'passed']);
  });

  it('applies only the last extension when extensions share the same type', () => {
    const applied: string[] = [];
    const type = Symbol('shared');
    const track = (
      label: string
    ): ResourceExtension<Resource<number | undefined>> => ({
      type,
      apply: () => applied.push(label),
    });
    const { resource } = createTestResource<number>();

    TestBed.runInInjectionContext(() =>
      extendResource(resource, track('first'), track('second'))
    );

    expect(applied).toEqual(['second']);
  });

  it('lets a custom extension reusing a built-in type participate in deduplication', () => {
    const { resource } = createTestResource<number>();
    const custom: ResourceExtension<Resource<number | undefined>> = {
      type: LOADING_EXTENSION_TYPE,
      apply: (res) => {
        Object.defineProperty(res, 'value', {
          value: () => 99,
          configurable: true,
        });
      },
    };

    TestBed.runInInjectionContext(() =>
      extendResource(resource, withValueOnLoading(10), custom)
    );

    expect(resource.value()).toBe(99);
  });

  describe('integration with built-in extensions and provideResourceExtensions', () => {
    it('applies a passed extension', () => {
      const { resource, initLoading } = createTestResource<number>();

      TestBed.runInInjectionContext(() =>
        extendResource(resource, withValueOnLoading(10))
      );
      initLoading();

      expect(resource.isLoading()).toBe(true);
      expect(resource.value()).toBe(10);
    });

    it('applies multiple passed extensions', async () => {
      const {
        resource,
        initLoading,
        updateParam,
        resolveWithValue,
        rejectWithError,
      } = createTestResource<number>();

      TestBed.runInInjectionContext(() =>
        extendResource(resource, withValueOnLoading(10), withValueOnError(20))
      );
      initLoading();

      expect(resource.value()).toBe(10);

      await resolveWithValue(1);
      expect(resource.value()).toBe(1);

      updateParam();
      await rejectWithError(new Error('failed'));
      expect(resource.value()).toBe(20);
    });

    it('applies globally provided extensions', async () => {
      TestBed.configureTestingModule({
        providers: [provideResourceExtensions(withValueOnError(0))],
      });
      const { resource, initLoading, rejectWithError } =
        createTestResource<number>();

      TestBed.runInInjectionContext(() => extendResource(resource));
      initLoading();
      await rejectWithError(new Error('failed'));

      expect(resource.value()).toBe(0);
    });

    it('lets a passed extension override a globally provided one of the same type', () => {
      TestBed.configureTestingModule({
        providers: [provideResourceExtensions(withPreviousValueOnLoading())],
      });
      const { resource, initLoading } = createTestResource<number>();

      TestBed.runInInjectionContext(() =>
        extendResource(resource, withValueOnLoading(20))
      );
      initLoading();

      expect(resource.value()).toBe(20);
    });
  });
});
