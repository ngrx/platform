import {
  createRenderScheduler,
  RenderScheduler,
} from '../../src/core/render-scheduler';
import { NoopTickScheduler } from '../../src/core/tick-scheduler';
import { MockChangeDetectorRef } from '../fixtures/fixtures';
import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Injectable } from '@angular/core';

describe('createRenderScheduler', () => {
  it('should initialize within injection context', () => {
    @Injectable({ providedIn: 'root' })
    class Service {
      readonly renderScheduler = createRenderScheduler();
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      ],
    });

    const renderScheduler = TestBed.inject(Service).renderScheduler;
    expect(renderScheduler).toBeInstanceOf(RenderScheduler);
  });

  it('should throw an error out of injection context', () => {
    expect(() => createRenderScheduler()).toThrowError();
  });
});

describe('RenderScheduler', () => {
  function setup() {
    const cdRef = new MockChangeDetectorRef();
    const tickScheduler = new NoopTickScheduler();
    jest.spyOn(tickScheduler, 'schedule');
    const renderScheduler = new RenderScheduler(cdRef, tickScheduler);

    return { cdRef, renderScheduler, tickScheduler };
  }

  describe('schedule', () => {
    it('should call cdRef.markForCheck and tickScheduler.schedule', () => {
      const { cdRef, renderScheduler, tickScheduler } = setup();
      renderScheduler.schedule();

      expect(cdRef.markForCheck).toHaveBeenCalledTimes(1);
      expect(tickScheduler.schedule).toHaveBeenCalledTimes(1);
    });
  });
});
