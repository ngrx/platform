import { Component, inject, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function testEffects(testFn: (tick: () => void) => void): () => void {
  @Component({ template: '', standalone: true })
  class TestComponent {}

  return () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    TestBed.runInInjectionContext(() => testFn(() => fixture.detectChanges()));
  };
}

export function initializeLocalStore<StoreClass extends Type<unknown>>(
  Store: StoreClass
): {
  store: InstanceType<StoreClass>;
  destroy: () => void;
} {
  @Component({
    standalone: true,
    template: '',
    providers: [Store],
  })
  class TestComponent {
    store = inject(Store);
  }

  const fixture = TestBed.configureTestingModule({
    imports: [TestComponent],
  }).createComponent(TestComponent);

  return {
    store: fixture.componentInstance.store,
    destroy: () => fixture.destroy(),
  };
}
