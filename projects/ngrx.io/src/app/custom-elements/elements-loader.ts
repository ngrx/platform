import {
    Inject,
    Injectable,
    NgModuleRef,
    NgModuleFactory,
    Type,
    Compiler,
} from '@angular/core';
import { ELEMENT_MODULE_PATHS_TOKEN, WithCustomElementComponent } from './element-registry';
import { from as fromPromise, Observable, of } from 'rxjs';
import { createCustomElement } from '@angular/elements';
import { LoadChildrenCallback } from '@angular/router';

@Injectable()
export class ElementsLoader {
    /** Map of unregistered custom elements and their respective module paths to load. */
    private elementsToLoad: Map<string, LoadChildrenCallback>;
    /** Map of custom elements that are in the process of being loaded and registered. */
    private elementsLoading = new Map<string, Promise<void>>();

    constructor(private moduleRef: NgModuleRef<any>,
        @Inject(ELEMENT_MODULE_PATHS_TOKEN) elementModulePaths: Map<string, LoadChildrenCallback>,
        private compiler: Compiler) {
        this.elementsToLoad = new Map(elementModulePaths);
    }

    /**
   * Queries the provided element for any custom elements that have not yet been registered with
   * the browser. Custom elements that are registered will be removed from the list of unregistered
   * elements so that they will not be queried in subsequent calls.
   */
    loadContainedCustomElements(element: HTMLElement): Observable<void> {
        const unregisteredSelectors = Array.from(this.elementsToLoad.keys())
            .filter(s => element.querySelector(s));

        if (!unregisteredSelectors.length) {
            return of(undefined);
        }

        // Returns observable that completes when all discovered elements have been registered.
        const allRegistered = Promise.all(unregisteredSelectors.map(s => this.loadCustomElement(s)));
        return fromPromise(allRegistered.then(() => undefined));
    }

    /** Loads and registers the custom element defined on the `WithCustomElement` module factory. */
    loadCustomElement(selector: string): Promise<void> {
        if (this.elementsLoading.has(selector)) {
            // The custom element is in the process of being loaded and registered.
            return this.elementsLoading.get(selector)!;
        }

        if (this.elementsToLoad.has(selector)) {
            // Load and register the custom element (for the first time).
            const modulePathLoader = this.elementsToLoad.get(selector)!;
            const loadedAndRegistered =
          (modulePathLoader() as Promise<NgModuleFactory<WithCustomElementComponent> | Type<WithCustomElementComponent>>)
              .then(elementModuleOrFactory => {
                  /**
             * With View Engine, the NgModule factory is created and provided when loaded.
             * With Ivy, only the NgModule class is provided loaded and must be compiled.
             * This uses the same mechanism as the deprecated `SystemJsNgModuleLoader` in
             * in `packages/core/src/linker/system_js_ng_module_factory_loader.ts`
             * to pass on the NgModuleFactory, or compile the NgModule and return its NgModuleFactory.
             */
                  if (elementModuleOrFactory instanceof NgModuleFactory) {
                      return elementModuleOrFactory;
                  } else {
                      return this.compiler.compileModuleAsync(elementModuleOrFactory);
                  }
              })
              .then(elementModuleFactory => {
                  const elementModuleRef = elementModuleFactory.create(this.moduleRef.injector);
                  const injector = elementModuleRef.injector;
                  const CustomElementComponent = elementModuleRef.instance.customElementComponent;
                  const CustomElement = createCustomElement(CustomElementComponent, {injector});

                  customElements!.define(selector, CustomElement);
                  return customElements.whenDefined(selector);
              })
              .then(() => {
                  // The custom element has been successfully loaded and registered.
                  // Remove from `elementsLoading` and `elementsToLoad`.
                  this.elementsLoading.delete(selector);
                  this.elementsToLoad.delete(selector);
              })
              .catch(err => {
                  // The custom element has failed to load and register.
                  // Remove from `elementsLoading`.
                  // (Do not remove from `elementsToLoad` in case it was a temporary error.)
                  this.elementsLoading.delete(selector);
                  return Promise.reject(err);
              });

            this.elementsLoading.set(selector, loadedAndRegistered);
            return loadedAndRegistered;
        }

        // The custom element has already been loaded and registered.
        return Promise.resolve();
    }
}
