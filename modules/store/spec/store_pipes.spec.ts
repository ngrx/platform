import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { Component, inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'test', standalone: true })
export class TestPipe implements PipeTransform {
  store = inject(Store);

  transform(s: number) {
    this.store.select('count');
    return s * 2;
  }
}

@Component({
  selector: 'test-component',
  standalone: true,
  imports: [TestPipe],
  template: `{{ 3 | test }}`,
})
export class TestComponent {}

describe('NgRx Store Integration', () => {
  describe('with pipes', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [
          provideStore({ count: () => 2 }, { initialState: { count: 2 } }),
        ],
      });
    });

    it('should not throw an error', () => {
      const component = TestBed.createComponent(TestComponent);

      component.detectChanges();

      expect(component.nativeElement.textContent).toBe('6');
    });
  });
});
