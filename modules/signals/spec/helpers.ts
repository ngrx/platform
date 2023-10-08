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

export function createLocalService<Service extends Type<unknown>>(
  serviceToken: Service
): {
  service: InstanceType<Service>;
  tick: () => void;
  destroy: () => void;
} {
  @Component({
    standalone: true,
    template: '',
    providers: [serviceToken],
  })
  class TestComponent {
    service = inject(serviceToken);
  }

  const fixture = TestBed.configureTestingModule({
    imports: [TestComponent],
  }).createComponent(TestComponent);

  return {
    service: fixture.componentInstance.service,
    tick: () => fixture.detectChanges(),
    destroy: () => fixture.destroy(),
  };
}
