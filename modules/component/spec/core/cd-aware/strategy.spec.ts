import {
  createIdleStrategy,
  StrategyFactoryConfig,
} from '../../../src/core/cd-aware/strategy';
import { Component, Injector } from '@angular/core';
import { getGlobalThis, hasZone, isIvy } from '../../../src/core/utils';
import { range } from 'rxjs';
import { TestBed } from '@angular/core/testing';

class ChangeDetectorRef {
  public markForCheck(): void {}

  public detectChanges(): void {}
}

@Component({
  template: `
    Test
  `,
})
class TestComponent {
  constructor(public cdRef: ChangeDetectorRef) {}
}

let fixtureTestComponent: any;
let testComponent: {
  cdRef: ChangeDetectorRef;
};
let componentNativeElement: any;

const setupTestComponent = () => {
  TestBed.configureTestingModule({
    providers: [ChangeDetectorRef],
  });
};

let changeDetectorRef: any;

beforeAll(() => {
  const injector = Injector.create([
    { provide: ChangeDetectorRef, useClass: ChangeDetectorRef, deps: [] },
  ]);
  changeDetectorRef = injector.get(ChangeDetectorRef);

  TestBed.configureTestingModule({
    declarations: [TestComponent],
    providers: [ChangeDetectorRef],
  });

  fixtureTestComponent = TestBed.createComponent(TestComponent);
  testComponent = fixtureTestComponent.componentInstance;
  componentNativeElement = fixtureTestComponent.nativeElement;
});

xdescribe('Strategy env setup and config generation', () => {
  it('should create Ivy zone-full', () => {
    const cfg = setUpIvyZoneFullEnvAndGetCgf();

    expect(isIvy()).toBe(true);
    expect(cfg.component).toBeDefined();
    expect(hasZone()).toBe(true);
    expect(cfg.cdRef).toBeDefined();
  });

  it('should create Ivy zone-less', () => {
    const cfg = setUpIvyZoneLessEnvAndGetCgf();

    expect(isIvy()).toBe(true);
    expect(cfg.component).toBeDefined();
    expect(hasZone()).toBe(false);
    expect(cfg.cdRef).toBeDefined();
  });

  it('should create ViewEngine zone-full', () => {
    const cfg = setUpViewEngineZoneFullEnvAndGetCgf();

    expect(isIvy()).toBe(false);
    expect(cfg.component).toBeDefined();
    expect(hasZone()).toBe(true);
    expect(cfg.cdRef).toBeDefined();
  });

  it('should create ViewEngine zone-less', () => {
    const cfg = setUpViewEngineZoneLessEnvAndGetCgf();

    expect(isIvy()).toBe(false);
    expect(hasZone()).toBe(false);
    expect(cfg.component).toBeDefined();
    expect(cfg.cdRef).toBeDefined();
  });
});

xdescribe('createIdleStrategy', () => {
  it('should return strategy', () => {
    const cfg = setUpIvyZoneFullEnvAndGetCgf();
    const idleStrategy = createIdleStrategy(cfg);
    expect(idleStrategy).toBeDefined();
  });

  it('should render:markForCheck, behaviour:noop in VE zone-full mode', () => {
    const cfg = setUpIvyZoneFullEnvAndGetCgf();
    const markForCheckSpy = jasmine.createSpy('markForCheck');
    cfg.cdRef.markForCheck = markForCheckSpy;
    const idleStrategy = createIdleStrategy(cfg);

    expect(markForCheckSpy).not.toHaveBeenCalled();
    idleStrategy.render();
    // expect(markForCheckSpy).toHaveBeenCalled();

    const nextSpy = jasmine.createSpy('next');
    range(1, 5)
      .pipe(idleStrategy.behaviour())
      .subscribe(v => nextSpy(v));
    expect(nextSpy).toHaveBeenCalledTimes(5);
  });

  it('should render:markForCheck, behaviour:noop in VE zone-less mode', () => {
    const cfg = setUpIvyZoneLessEnvAndGetCgf();
    const markForCheckSpy = jasmine.createSpy('markForCheck');
    cfg.cdRef.markForCheck = markForCheckSpy;
    const idleStrategy = createIdleStrategy(cfg);

    expect(markForCheckSpy).not.toHaveBeenCalled();
    // idleStrategy.render();
    // expect(markForCheckSpy).toHaveBeenCalled();

    const nextSpy = jasmine.createSpy('next');
    range(1, 5)
      .pipe(idleStrategy.behaviour())
      .subscribe(v => nextSpy(v));
    expect(nextSpy).toHaveBeenCalledTimes(5);
  });

  it('should render:markForCheck, behaviour:noop in Ivy zone-full mode', () => {
    const cfg = setUpIvyZoneFullEnvAndGetCgf();
    const markForCheckSpy = jasmine.createSpy('markForCheck');
    cfg.cdRef.markForCheck = markForCheckSpy;
    const idleStrategy = createIdleStrategy(cfg);

    expect(markForCheckSpy).not.toHaveBeenCalled();
    // idleStrategy.render();
    // expect(markForCheckSpy).toHaveBeenCalled();

    const nextSpy = jasmine.createSpy('next');
    range(1, 5)
      .pipe(idleStrategy.behaviour())
      .subscribe(v => nextSpy(v));
    expect(nextSpy).toHaveBeenCalledTimes(5);
  });

  it('should render:markForCheck, behaviour:noop in Ivy zone-less mode', () => {
    const cfg = setUpIvyZoneLessEnvAndGetCgf();
    const markForCheckSpy = jasmine.createSpy('markForCheck');
    cfg.cdRef.markForCheck = markForCheckSpy;
    const idleStrategy = createIdleStrategy(cfg);

    expect(markForCheckSpy).not.toHaveBeenCalled();
    // idleStrategy.render();
    // expect(markForCheckSpy).toHaveBeenCalled();

    const nextSpy = jasmine.createSpy('next');
    range(1, 5)
      .pipe(idleStrategy.behaviour())
      .subscribe(v => nextSpy(v));
    expect(nextSpy).toHaveBeenCalledTimes(5);
  });
});

// ===

function setUpIvyZoneFullEnvAndGetCgf(): StrategyFactoryConfig {
  getGlobalThis().ng = undefined;
  return {
    cdRef: changeDetectorRef,
    component: (testComponent.cdRef as any).context,
  };
}

function setUpIvyZoneLessEnvAndGetCgf(): StrategyFactoryConfig {
  getGlobalThis().ng = undefined;
  return {
    cdRef: changeDetectorRef,
    component: changeDetectorRef.context,
  };
}

function setUpViewEngineZoneFullEnvAndGetCgf(): StrategyFactoryConfig {
  getGlobalThis().ng = { probe: 'simulate ViewEngine' };
  return {
    cdRef: changeDetectorRef,
    component: changeDetectorRef.context,
  };
}

function setUpViewEngineZoneLessEnvAndGetCgf(): StrategyFactoryConfig {
  getGlobalThis().ng = { probe: 'simulate ViewEngine' };
  return {
    cdRef: changeDetectorRef,
    component: changeDetectorRef.context,
  };
}
