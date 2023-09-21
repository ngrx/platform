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

export function createLocalStore<Store extends Type<unknown>>(
  storeToken: Store
): {
  store: InstanceType<Store>;
  destroy: () => void;
} {
  @Component({
    standalone: true,
    template: '',
    providers: [storeToken],
  })
  class TestComponent {
    store = inject(storeToken);
  }

  const fixture = TestBed.configureTestingModule({
    imports: [TestComponent],
  }).createComponent(TestComponent);

  return {
    store: fixture.componentInstance.store,
    destroy: () => fixture.destroy(),
  };
}
