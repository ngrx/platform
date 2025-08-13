import {
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ApplicationRef, NgZone, PLATFORM_ID } from '@angular/core';
import {
  NoopTickScheduler,
  TickScheduler,
  ZonelessTickScheduler,
} from '../../src/core/tick-scheduler';
import { ngZoneMock, noopNgZoneMock } from '../fixtures/fixtures';

describe('TickScheduler', () => {
  function setup(ngZone: unknown, isSsrMode = false) {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgZone, useValue: ngZone },
        {
          provide: PLATFORM_ID,
          useValue: isSsrMode ? 'server' : 'browser',
        },
      ],
    });
    const tickScheduler = TestBed.inject(TickScheduler);
    const appRef = TestBed.inject(ApplicationRef);
    jest.spyOn(appRef, 'tick');

    return { tickScheduler, appRef };
  }

  describe('when NgZone is provided', () => {
    it('should initialize NoopTickScheduler', () => {
      const { tickScheduler } = setup(ngZoneMock);
      expect(tickScheduler instanceof NoopTickScheduler).toBe(true);
    });
  });

  describe('when NgZone is not provided and running in browser mode', () => {
    // `fakeAsync` uses 16ms as `requestAnimationFrame` delay
    const animationFrameDelay = 16;

    it('should initialize ZonelessTickScheduler', () => {
      const { tickScheduler } = setup(noopNgZoneMock);
      expect(tickScheduler instanceof ZonelessTickScheduler).toBe(true);
    });

    it('should schedule tick using requestAnimationFrame', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock);

      tickScheduler.schedule();

      expect(appRef.tick).toHaveBeenCalledTimes(0);
      tick(animationFrameDelay / 2);
      expect(appRef.tick).toHaveBeenCalledTimes(0);
      tick(animationFrameDelay / 2);
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should coalesce multiple synchronous schedule calls', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock);

      tickScheduler.schedule();
      tickScheduler.schedule();
      tickScheduler.schedule();

      tick(animationFrameDelay);
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should coalesce multiple schedule calls that are queued to the microtask queue', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock);

      queueMicrotask(() => tickScheduler.schedule());
      queueMicrotask(() => tickScheduler.schedule());
      queueMicrotask(() => tickScheduler.schedule());

      flushMicrotasks();
      expect(appRef.tick).toHaveBeenCalledTimes(0);
      tick(animationFrameDelay);
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should schedule multiple ticks for multiple asynchronous schedule calls', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock);

      setTimeout(() => tickScheduler.schedule(), 100);
      setTimeout(() => tickScheduler.schedule(), 200);
      setTimeout(() => tickScheduler.schedule(), 300);

      tick(300 + animationFrameDelay);
      expect(appRef.tick).toHaveBeenCalledTimes(3);
    }));
  });

  describe('when NgZone is not provided and running in SSR mode', () => {
    it('should initialize ZonelessTickScheduler', () => {
      const { tickScheduler } = setup(noopNgZoneMock, true);
      expect(tickScheduler instanceof ZonelessTickScheduler).toBe(true);
    });

    it('should schedule tick using setTimeout', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock, true);

      tickScheduler.schedule();

      expect(appRef.tick).toHaveBeenCalledTimes(0);
      tick();
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should coalesce multiple synchronous schedule calls', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock, true);

      tickScheduler.schedule();
      tickScheduler.schedule();
      tickScheduler.schedule();

      tick();
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should coalesce multiple schedule calls that are queued to the microtask queue', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock, true);

      queueMicrotask(() => tickScheduler.schedule());
      queueMicrotask(() => tickScheduler.schedule());
      queueMicrotask(() => tickScheduler.schedule());

      flushMicrotasks();
      expect(appRef.tick).toHaveBeenCalledTimes(0);
      tick();
      expect(appRef.tick).toHaveBeenCalledTimes(1);
    }));

    it('should schedule multiple ticks for multiple asynchronous schedule calls', fakeAsync(() => {
      const { tickScheduler, appRef } = setup(noopNgZoneMock, true);

      setTimeout(() => tickScheduler.schedule(), 100);
      setTimeout(() => tickScheduler.schedule(), 200);
      setTimeout(() => tickScheduler.schedule(), 300);

      tick(300);
      expect(appRef.tick).toHaveBeenCalledTimes(3);
    }));
  });
});
