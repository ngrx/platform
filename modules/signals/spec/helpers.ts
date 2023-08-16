import { Component } from '@angular/core';
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
