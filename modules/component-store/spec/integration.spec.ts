import { Component, Type, Injectable } from '@angular/core';
import { ComponentStore } from '../src';
import {
  TestBed,
  ComponentFixture,
  flushMicrotasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { interval, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { By } from '@angular/platform-browser';

describe('ComponentStore integration', () => {
  // The same set of tests is run against different versions of how
  // ComponentStore may be used - making sure all of them work.
  function testWith(setup: () => Promise<SetupData<Child>>) {
    let state: SetupData<Child>;
    beforeEach(async () => {
      state = await setup();
    });

    it('does not emit until state is initialized', fakeAsync(() => {
      expect(state.parent.isChildVisible).toBe(true);
      expect(state.hasChild()).toBe(true);

      state.fixture.detectChanges();
      flushMicrotasks();

      // No values emitted,             👇 no initial state
      expect(state.propChanges).toEqual([]);
      expect(state.prop2Changes).toEqual([]);
    }));

    it('gets initial value when state is initialized', fakeAsync(() => {
      state.child.init();
      flushMicrotasks();
      //                            init state👇
      expect(state.propChanges).toEqual(['initial Value']);
      expect(state.prop2Changes).toEqual([undefined]);

      // clear "Periodic timers in queue"
      state.destroy();
    }));

    it('effect updates values', fakeAsync(() => {
      state.child.init();

      tick(40);
      // New value pushed every 10 ms.
      expect(state.prop2Changes).toEqual([undefined, 0, 1, 2, 3]);

      // clear "Periodic timers in queue"
      state.destroy();
    }));

    it('updates values imperatively', fakeAsync(() => {
      state!.child.init();

      state!.child.updateProp('new value');
      flushMicrotasks();
      state!.child.updateProp('yay!!!');
      flushMicrotasks();

      expect(state!.propChanges).toContain('new value');
      expect(state!.propChanges).toContain('yay!!!');

      // clear "Periodic timers in queue"
      state.destroy();
    }));

    it('stops observables when destroyed', fakeAsync(() => {
      state.child.init();

      tick(40);
      // New value pushed every 10 ms.
      expect(state.prop2Changes).toEqual([undefined, 0, 1, 2, 3]);

      state.parent.isChildVisible = false;
      state.fixture.detectChanges();

      tick(20);
      // Still at the same values, so effect stopped running
      expect(state.prop2Changes).toEqual([undefined, 0, 1, 2, 3]);
    }));

    it('ComponentStore is destroyed', () => {
      state.child.init();

      state.parent.isChildVisible = false;
      state.fixture.detectChanges();

      expect(state.componentStoreDestroySpy).toHaveBeenCalled();
    });
  }

  describe('Component uses ComponentStore directly in providers', () => {
    testWith(setupComponentProvidesComponentStore);
  });

  describe('Component uses ComponentStore directly by extending it', () => {
    testWith(setupComponentExtendsComponentStore);
  });

  describe('Component provides a Service that extends ComponentStore', () => {
    testWith(setupComponentProvidesService);
  });

  describe('Component extends a Service that extends ComponentStore', () => {
    testWith(setupComponentExtendsService);
  });

  interface State {
    prop: string;
    prop2?: number;
  }

  interface Parent {
    isChildVisible: boolean;
  }

  interface Child {
    prop$: Observable<string>;
    prop2$: Observable<number | undefined>;
    init: () => void;
    updateProp(value: string): void;
  }

  interface SetupData<T extends Child> {
    fixture: ComponentFixture<Parent>;
    parent: Parent;
    child: T;
    hasChild: () => boolean;
    propChanges: string[];
    prop2Changes: Array<number | undefined>;
    destroy: () => void;
    componentStoreDestroySpy: jest.SpyInstance;
  }

  @Component({
    selector: 'body',
    template: '<child *ngIf="isChildVisible"></child>',
  })
  class ParentComponent implements Parent {
    isChildVisible = true;
  }

  async function setupTestBed<T extends Child>(
    childClass: Type<T>
  ): Promise<Omit<SetupData<T>, 'componentStoreDestroySpy' | 'destroy'>> {
    await TestBed.configureTestingModule({
      declarations: [ParentComponent, childClass],
      imports: [CommonModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(ParentComponent);
    fixture.detectChanges();

    function getChild(): T | undefined {
      const debugEl = fixture.debugElement.query(By.css('child'));
      if (debugEl) {
        return debugEl.componentInstance as T;
      }
      return undefined;
    }

    const propChanges: string[] = [];
    const prop2Changes: Array<number | undefined> = [];
    const child = getChild()!;
    child.prop$.subscribe((v) => propChanges.push(v));
    child.prop2$.subscribe((v) => prop2Changes.push(v));

    return {
      fixture,
      parent: fixture.componentInstance,
      child,
      hasChild: () => !!getChild(),
      propChanges,
      prop2Changes,
    };
  }

  async function setupComponentProvidesComponentStore() {
    @Component({
      selector: 'child',
      template: '<div>{{prop$ | async}}</div>',
      providers: [ComponentStore],
    })
    class ChildComponent implements Child {
      prop$ = this.componentStore.select((state) => state.prop);
      prop2$ = this.componentStore.select((state) => state.prop2);

      intervalToProp2Effect = this.componentStore.effect(
        (numbers$: Observable<number>) =>
          numbers$.pipe(
            tap((n) => {
              this.componentStore.setState((state) => ({
                ...state,
                prop2: n,
              }));
            })
          )
      );
      interval$ = interval(10);

      constructor(readonly componentStore: ComponentStore<State>) {}

      init() {
        this.componentStore.setState({ prop: 'initial Value' });
        this.intervalToProp2Effect(this.interval$);
      }

      updateProp(value: string): void {
        this.componentStore.setState((state) => ({ ...state, prop: value }));
      }
    }

    const setup = await setupTestBed(ChildComponent);
    const componentStoreDestroySpy = jest.spyOn(
      setup.child.componentStore,
      'ngOnDestroy'
    );
    return {
      ...setup,
      destroy: () => setup.child.componentStore.ngOnDestroy(),
      componentStoreDestroySpy,
    };
  }

  async function setupComponentExtendsComponentStore() {
    @Component({
      selector: 'child',
      template: '<div>{{prop$ | async}}</div>',
    })
    class ChildComponent extends ComponentStore<State> implements Child {
      prop$ = this.select((state) => state.prop);
      prop2$ = this.select((state) => state.prop2);

      intervalToProp2Effect = this.effect((numbers$: Observable<number>) =>
        numbers$.pipe(
          tap((n) => {
            this.setState((state) => ({
              ...state,
              prop2: n,
            }));
          })
        )
      );
      interval$ = interval(10);

      init() {
        this.setState({ prop: 'initial Value' });
        this.intervalToProp2Effect(this.interval$);
      }

      updateProp(value: string): void {
        this.setState((state) => ({ ...state, prop: value }));
      }
    }

    const setup = await setupTestBed(ChildComponent);
    const componentStoreDestroySpy = jest.spyOn(setup.child, 'ngOnDestroy');
    return {
      ...setup,
      destroy: () => setup.child.ngOnDestroy(),
      componentStoreDestroySpy,
    };
  }

  async function setupComponentProvidesService() {
    @Injectable()
    class PropsStore extends ComponentStore<State> {
      prop$ = this.select((state) => state.prop);
      prop2$ = this.select((state) => state.prop2);

      propUpdater = this.updater((state, value: string) => ({
        ...state,
        prop: value,
      }));
      prop2Updater = this.updater((state, value: number) => ({
        ...state,
        prop2: value,
      }));

      intervalToProp2Effect = this.effect((numbers$: Observable<number>) =>
        numbers$.pipe(
          tap((n) => {
            this.prop2Updater(n);
          })
        )
      );
    }

    @Component({
      selector: 'child',
      template: '<div>{{prop$ | async}}</div>',
      providers: [PropsStore],
    })
    class ChildComponent implements Child {
      prop$ = this.propsStore.prop$;
      prop2$ = this.propsStore.prop2$;
      interval$ = interval(10);

      constructor(readonly propsStore: PropsStore) {}

      init() {
        this.propsStore.setState({ prop: 'initial Value' });
        this.propsStore.intervalToProp2Effect(this.interval$);
      }

      updateProp(value: string): void {
        this.propsStore.propUpdater(value);
      }
    }

    const setup = await setupTestBed(ChildComponent);
    const componentStoreDestroySpy = jest.spyOn(
      setup.child.propsStore,
      'ngOnDestroy'
    );
    return {
      ...setup,
      destroy: () => setup.child.propsStore.ngOnDestroy(),
      componentStoreDestroySpy,
    };
  }

  async function setupComponentExtendsService() {
    @Injectable()
    class PropsStore extends ComponentStore<State> {
      prop$ = this.select((state) => state.prop);
      prop2$ = this.select((state) => state.prop2);

      propUpdater = this.updater((state, value: string) => ({
        ...state,
        prop: value,
      }));
      prop2Updater = this.updater((state, value: number) => ({
        ...state,
        prop2: value,
      }));

      intervalToProp2Effect = this.effect((numbers$: Observable<number>) =>
        numbers$.pipe(
          tap((n) => {
            this.prop2Updater(n);
          })
        )
      );
    }

    @Component({
      selector: 'child',
      template: '<div>{{prop$ | async}}</div>',
    })
    class ChildComponent extends PropsStore implements Child {
      interval$ = interval(10);

      init() {
        this.setState({ prop: 'initial Value' });
        this.intervalToProp2Effect(this.interval$);
      }

      updateProp(value: string): void {
        this.propUpdater(value);
      }
    }

    const setup = await setupTestBed(ChildComponent);
    const componentStoreDestroySpy = jest.spyOn(setup.child, 'ngOnDestroy');
    return {
      ...setup,
      destroy: () => setup.child.ngOnDestroy(),
      componentStoreDestroySpy,
    };
  }
});
