import { Component, inject, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function createLocalService<Service extends Type<unknown>>(
  serviceToken: Service
): {
  service: InstanceType<Service>;
  flush: () => void;
  destroy: () => void;
} {
  @Component({
    template: '',
    providers: [serviceToken],
  })
  class TestComponent {
    service = inject(serviceToken);
  }

  const fixture = TestBed.configureTestingModule({
    imports: [TestComponent],
  }).createComponent(TestComponent);
  fixture.detectChanges();

  return {
    service: fixture.componentInstance.service,
    flush: () => {
      TestBed.tick();
      fixture.detectChanges();
    },
    destroy: () => fixture.destroy(),
  };
}
