import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '..';
import { Actions } from '@ngrx/effects';
import { Injector } from '@angular/core';

describe('Mock Actions', () => {
  describe('with TestBed', () => {
    it('should provide Actions from source', () => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = TestBed.inject(Actions);
      return new Promise<void>((resolve) => {
        actions$.subscribe((action) => {
          expect(action.type).toBe('foo');
          resolve();
        });
      });
    });

    it('should provide Actions from factory', () => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = TestBed.inject(Actions);
      return new Promise<void>((resolve) => {
        actions$.subscribe((action) => {
          expect(action.type).toBe('bar');
          resolve();
        });
      });
    });
  });

  describe('with Injector', () => {
    it('should provide Actions from source', () => {
      const injector = Injector.create({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = injector.get(Actions);
      return new Promise<void>((resolve) => {
        actions$.subscribe((action) => {
          expect(action.type).toBe('foo');
          resolve();
        });
      });
    });

    it('should provide Actions from factory', () => {
      const injector = Injector.create({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = injector.get(Actions);
      return new Promise<void>((resolve) => {
        actions$.subscribe((action) => {
          expect(action.type).toBe('bar');
          resolve();
        });
      });
    });
  });
});
