import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { Injector } from '@angular/core';

describe('Mock Actions', () => {
  describe('with TestBed', () => {
    it('should provide Actions from source', (done: any) => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = TestBed.inject(Actions);
      actions$.subscribe((action) => {
        expect(action.type).toBe('foo');
        done();
      });
    });

    it('should provide Actions from factory', (done: any) => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = TestBed.inject(Actions);
      actions$.subscribe((action) => {
        expect(action.type).toBe('bar');
        done();
      });
    });
  });

  describe('with Injector', () => {
    it('should provide Actions from source', (done: any) => {
      const injector = Injector.create({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = injector.get(Actions);
      actions$.subscribe((action) => {
        expect(action.type).toBe('foo');
        done();
      });
    });

    it('should provide Actions from factory', (done: any) => {
      const injector = Injector.create({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = injector.get(Actions);
      actions$.subscribe((action) => {
        expect(action.type).toBe('bar');
        done();
      });
    });
  });
});
