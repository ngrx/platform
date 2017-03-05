import { ReflectiveInjector, ModuleWithProviders } from '@angular/core';


export function createInjector({ ngModule, providers }: ModuleWithProviders): ReflectiveInjector {
  const injector = ReflectiveInjector.resolveAndCreate([ ...(providers || []), ngModule ]);

  injector.get(ngModule);

  return injector;
}

export function createChildInjector(parent: ReflectiveInjector, { ngModule, providers }: ModuleWithProviders): ReflectiveInjector {
  const injector = parent.resolveAndCreateChild([ ...(providers || []), ngModule ]);

  injector.get(ngModule);

  return injector;
}