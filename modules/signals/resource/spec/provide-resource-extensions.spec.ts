import {
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  Resource,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideResourceExtensions,
  RESOURCE_EXTENSIONS,
  ResourceExtension,
} from '../src';

describe('provideResourceExtensions', () => {
  const extA: ResourceExtension<Resource<unknown>> = {
    type: Symbol('a'),
    apply: () => {},
  };
  const extB: ResourceExtension<Resource<unknown>> = {
    type: Symbol('b'),
    apply: () => {},
  };

  it('registers the extensions under the RESOURCE_EXTENSIONS token', () => {
    TestBed.configureTestingModule({
      providers: [provideResourceExtensions(extA, extB)],
    });

    const extensions = TestBed.runInInjectionContext(() =>
      inject(RESOURCE_EXTENSIONS)
    );

    expect(extensions).toEqual([extA, extB]);
  });

  it('composes with extensions registered by parent injectors', () => {
    const parentInjector = createEnvironmentInjector(
      [provideResourceExtensions(extA)],
      TestBed.inject(EnvironmentInjector)
    );
    const childInjector = createEnvironmentInjector(
      [provideResourceExtensions(extB)],
      parentInjector
    );

    const extensions = runInInjectionContext(childInjector, () =>
      inject(RESOURCE_EXTENSIONS)
    );

    expect(extensions).toEqual([extA, extB]);
  });

  it('returns an empty list when no parent extensions are registered', () => {
    const injector = createEnvironmentInjector(
      [provideResourceExtensions()],
      TestBed.inject(EnvironmentInjector)
    );

    const extensions = runInInjectionContext(injector, () =>
      inject(RESOURCE_EXTENSIONS)
    );

    expect(extensions).toEqual([]);
  });
});
