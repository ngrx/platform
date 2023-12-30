import { Component, inject, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export function createLocalService<Service extends Type<unknown>>(
  serviceToken: Service,
  provideLocally = true
): {
  service: InstanceType<Service>;
  flushEffects: () => void;
  destroy: () => void;
} {
  @Component({
    standalone: true,
    template: '',
    providers: provideLocally ? [serviceToken] : [],
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
    flushEffects: () => TestBed.flushEffects(),
    destroy: () => fixture.destroy(),
  };
}
