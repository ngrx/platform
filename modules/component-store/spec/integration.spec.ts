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
import { interval, Observable, of, EMPTY } from 'rxjs';
import { tap, concatMap, catchError } from 'rxjs/operators';
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

      // No values emitted,             👇 no initial state
      expect(state.propChanges).toEqual([]);
      expect(state.prop2Changes).toEqual([]);
    }));

    it('gets initial value when state is initialized', fakeAsync(() => {
      state.child.init();
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
      state.child.init();

      state.child.updateProp('new value');
      state.child.updateProp('yay!!!');

      expect(state.propChanges).toContain('new value');
      expect(state.propChanges).toContain('yay!!!');

      // clear "Periodic timers in queue"
      state.destroy();
    }));

    it('selector emits values on any changes', fakeAsync(() => {
      state.child.init();

      state.child.updateProp('new value'); // no flushing in between
      state.child.updateProp('yay!!!');

      expect(state.propChanges).toEqual([
        'initial Value',
        'new value',
        'yay!!!',
      ]);

      // clear "Periodic timers in queue"
      state.destroy();
    }));

    it('selector with debounce emits value when microtasks are flushed', fakeAsync(() => {
      state.child.init();

      state.child.updateProp('new value'); // no flushing in between
      state.child.updateProp('yay!!!');

      expect(state.propChangesDebounce).toEqual([]);

      flushMicrotasks();
      expect(state.propChangesDebounce).toEqual(['yay!!!']);

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

      state.destroy();

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

  describe('ComponentStore getter', () => {
    let state: ReturnType<typeof setupComponentProvidesService> extends Promise<
      infer P
    >
      ? P
      : never;
    beforeEach(async () => {
      state = await setupComponentProvidesService();
    });

    it('provides correct instant values within effect', fakeAsync(() => {
      state.child.init();

      tick(40); // Prop2 should be at value '3' now
      state.child.call('test one:');

      expect(state.serviceCallSpy).toHaveBeenCalledWith('test one:3');

      tick(20); // Prop2 should be at value '5' now
      state.child.call('test two:');

      expect(state.serviceCallSpy).toHaveBeenCalledWith('test two:5');

      // clear "Periodic timers in queue"
      state.destroy();
    }));
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
    propDebounce$: Observable<string>;
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
    propChangesDebounce: Array<string | undefined>;
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
    const propChangesDebounce: Array<string | undefined> = [];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const child = getChild()!;
    child.prop$.subscribe((v) => propChanges.push(v));
    child.prop2$.subscribe((v) => prop2Changes.push(v));
    child.propDebounce$.subscribe((v) => propChangesDebounce.push(v));

    return {
      fixture,
      parent: fixture.componentInstance,
      child,
      hasChild: () => !!getChild(),
      propChanges,
      prop2Changes,
      propChangesDebounce,
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
      propDebounce$ = this.componentStore.select((state) => state.prop, {
        debounce: true,
      });

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
      propDebounce$ = this.select((state) => state.prop, { debounce: true });

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
    @Injectable({ providedIn: 'root' })
    class Service {
      call(arg: string) {
        return of('result');
      }
    }

    function getProp2(state: State): number | undefined {
      return state.prop2;
    }

    @Injectable()
    class PropsStore extends ComponentStore<State> {
      prop$ = this.select((state) => state.prop);
      // projector function 👇 reused in selector and getter
      prop2$ = this.select(getProp2);
      propDebounce$ = this.select((state) => state.prop, { debounce: true });

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

      callService = this.effect((strings$: Observable<string>) => {
        return strings$.pipe(
          //       getting value from State imperatively 👇
          concatMap((str) =>
            this.service.call(str + this.get(getProp2)).pipe(
              tap({
                next: (v) => this.propUpdater(v),
                error: () => {
                  /* handle error */
                },
              }),
              // make sure to catch errors
              catchError((e) => EMPTY)
            )
          )
        );
      });

      constructor(private readonly service: Service) {
        super();
      }
    }

    @Component({
      selector: 'child',
      template: '<div>{{prop$ | async}}</div>',
      providers: [PropsStore],
    })
    class ChildComponent implements Child {
      prop$ = this.propsStore.prop$;
      prop2$ = this.propsStore.prop2$;
      propDebounce$ = this.propsStore.propDebounce$;
      interval$ = interval(10);

      constructor(readonly propsStore: PropsStore) {}

      init() {
        this.propsStore.setState({ prop: 'initial Value' });
        this.propsStore.intervalToProp2Effect(this.interval$);
      }

      updateProp(value: string): void {
        this.propsStore.propUpdater(value);
      }

      call(str: string) {
        this.propsStore.callService(str);
      }
    }

    const setup = await setupTestBed(ChildComponent);
    const componentStoreDestroySpy = jest.spyOn(
      setup.child.propsStore,
      'ngOnDestroy'
    );

    const serviceCallSpy = jest.spyOn(TestBed.get(Service), 'call');
    return {
      ...setup,
      destroy: () => setup.child.propsStore.ngOnDestroy(),
      componentStoreDestroySpy,
      serviceCallSpy,
    };
  }

  async function setupComponentExtendsService() {
    @Injectable()
    class PropsStore extends ComponentStore<State> {
      prop$ = this.select((state) => state.prop);
      prop2$ = this.select((state) => state.prop2);
      propDebounce$ = this.select((state) => state.prop, { debounce: true });

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
