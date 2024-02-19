import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FakeRxMethod,
  asFakeRxMethod,
  getRxMethodFake,
  newFakeRxMethod,
} from '../src/fake-rx-method';
import { Subject } from 'rxjs';
import { RxMethod } from 'modules/signals/rxjs-interop/src/rx-method';

@Component({
  selector: 'app-test',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class TestComponent {
  fakeRxMethod = newFakeRxMethod<number>();
}

describe('FakeRxMethod', () => {
  describe('newFakeRxMethod and getRxMethodFake', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let fakeRxMethod: FakeRxMethod<number>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fakeRxMethod = component.fakeRxMethod;
    });

    it('updates the Sinon fake on imperative calls', () => {
      fakeRxMethod(11);
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(1);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([11]);
    });

    it('updates the Sinon fake when an observable input emits', () => {
      const o = new Subject<number>();
      fakeRxMethod(o);
      o.next(11);
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(1);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([11]);
      o.next(22);
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(2);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([22]);
    });

    it('updates the Sinon fake when a signal input emits (1)', () => {
      const s = signal(72);
      fakeRxMethod(s);
      fixture.detectChanges();
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(1);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([72]);
      s.set(23);
      fixture.detectChanges();
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(2);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([23]);
    });

    it('updates the Sinon fake when a signal input emits (2)', () => {
      const s = signal(72);
      fakeRxMethod(s);
      s.set(23);
      fixture.detectChanges();
      expect(getRxMethodFake(fakeRxMethod).callCount).toBe(1);
      expect(getRxMethodFake(fakeRxMethod).lastCall.args).toEqual([23]);
    });
  });

  describe('asFakeRxMethod', () => {
    it('should return the input wihtout change', () => {
      TestBed.runInInjectionContext(() => {
        const rxMethod = newFakeRxMethod<number>() as RxMethod<number>;
        expect(asFakeRxMethod(rxMethod)).toEqual(rxMethod);
      });
    });
  });
});
