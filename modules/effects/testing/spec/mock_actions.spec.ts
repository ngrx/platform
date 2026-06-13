import { firstValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '..';
import { Actions } from '@ngrx/effects';
import { Injector } from '@angular/core';

describe('Mock Actions', () => {
  describe('with TestBed', () => {
    it('should provide Actions from source', async () => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = TestBed.inject(Actions);
      const action = await firstValueFrom(actions$);
      expect(action.type).toBe('foo');
    });

    it('should provide Actions from factory', async () => {
      TestBed.configureTestingModule({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = TestBed.inject(Actions);
      const action = await firstValueFrom(actions$);
      expect(action.type).toBe('bar');
    });
  });

  describe('with Injector', () => {
    it('should provide Actions from source', async () => {
      const injector = Injector.create({
        providers: [provideMockActions(of({ type: 'foo' }))],
      });

      const actions$ = injector.get(Actions);
      const action = await firstValueFrom(actions$);
      expect(action.type).toBe('foo');
    });

    it('should provide Actions from factory', async () => {
      const injector = Injector.create({
        providers: [provideMockActions(() => of({ type: 'bar' }))],
      });

      const actions$ = injector.get(Actions);
      const action = await firstValueFrom(actions$);
      expect(action.type).toBe('bar');
    });
  });
});
