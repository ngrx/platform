import { ApplicationRef } from '@angular/core';
import {
    discardPeriodicTasks,
    fakeAsync,
    flushMicrotasks,
    TestBed,
    tick,
} from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';

import { Logger } from 'app/shared/logger.service';
import { SwUpdatesService } from './sw-updates.service';

describe('SwUpdatesService', () => {
    let appRef: MockApplicationRef;
    let service: SwUpdatesService;
    let swu: MockSwUpdate;
    let checkInterval: number;

    // Helpers
    // NOTE:
    //   Because `SwUpdatesService` uses the `interval` operator, it needs to be instantiated and
    //   destroyed inside the `fakeAsync` zone (when `fakeAsync` is used for the test). Thus, we can't
    //   run `setup()`/`tearDown()` in `beforeEach()`/`afterEach()` blocks. We use the `run()` helper
    //   to call them inside each test's zone.
    const setup = (isSwUpdateEnabled: boolean) => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ApplicationRef, useClass: MockApplicationRef },
                { provide: Logger, useClass: MockLogger },
                {
                    provide: SwUpdate,
                    useFactory: () => new MockSwUpdate(isSwUpdateEnabled),
                },
                SwUpdatesService,
            ],
        });

        appRef = TestBed.inject(ApplicationRef) as unknown as MockApplicationRef;
        service = TestBed.inject(SwUpdatesService);
        swu = TestBed.inject(SwUpdate) as unknown as MockSwUpdate;
        checkInterval = (service as any).checkInterval;
    };
    const tearDown = () => service.ngOnDestroy();
    const run = (specFn: VoidFunction, isSwUpdateEnabled = true) => () => {
        setup(isSwUpdateEnabled);
        specFn();
        tearDown();
    };

    it(
        'should create',
        run(() => {
            expect(service).toBeTruthy();
        })
    );

    it(
        'should start checking for updates when instantiated (once the app stabilizes)',
        run(() => {
            expect(swu.checkForUpdate).not.toHaveBeenCalled();

            appRef.isStable.next(false);
            expect(swu.checkForUpdate).not.toHaveBeenCalled();

            appRef.isStable.next(true);
            expect(swu.checkForUpdate).toHaveBeenCalled();
        })
    );

    it(
        'should periodically check for updates',
        fakeAsync(
            run(() => {
                appRef.isStable.next(true);
                swu.checkForUpdate.calls.reset();

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(1);

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(2);

                appRef.isStable.next(false);

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(3);

                discardPeriodicTasks();
            })
        )
    );

    it(
        'should activate available updates immediately',
        fakeAsync(
            run(() => {
                appRef.isStable.next(true);
                expect(swu.activateUpdate).not.toHaveBeenCalled();

                swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                expect(swu.activateUpdate).toHaveBeenCalled();
            })
        )
    );

    it(
        'should keep periodically checking for updates even after one is available/activated',
        fakeAsync(
            run(() => {
                appRef.isStable.next(true);
                swu.checkForUpdate.calls.reset();

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(1);

                swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(2);

                tick(checkInterval);
                expect(swu.checkForUpdate).toHaveBeenCalledTimes(3);

                discardPeriodicTasks();
            })
        )
    );

    it(
        'should emit on `updateActivated` when an update has been activated',
        fakeAsync(
            run(() => {
                let isActivated = false;
                service.updateActivated.subscribe(() => isActivated = true);

                swu.versionUpdates.next({ type: 'NO_NEW_VERSION_DETECTED' } as VersionEvent);
                flushMicrotasks();

                expect(isActivated).toBe(false);

                swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                flushMicrotasks();

                expect(isActivated).toBe(true);
            })
        )
    );

    describe('when `SwUpdate` is not enabled', () => {
        const runDeactivated = (specFn: VoidFunction) => run(specFn, false);

        it(
            'should not check for updates',
            fakeAsync(
                runDeactivated(() => {
                    appRef.isStable.next(true);

                    tick(checkInterval);
                    tick(checkInterval);

                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);

                    tick(checkInterval);
                    tick(checkInterval);

                    expect(swu.checkForUpdate).not.toHaveBeenCalled();
                })
            )
        );

        it(
            'should not activate available updates',
            fakeAsync(
                runDeactivated(() => {
                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                    expect(swu.activateUpdate).not.toHaveBeenCalled();
                })
            )
        );

        it(
            'should never emit on `updateActivated`',
            fakeAsync(
                runDeactivated(() => {
                    let isActivated = false;
                    service.updateActivated.subscribe(() => isActivated = true);

                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                    swu.versionUpdates.next({ type: 'VERSION_INSTALLATION_FAILED' } as VersionEvent);
                    flushMicrotasks();

                    expect(isActivated).toEqual(false);
                })
            )
        );
    });

    describe('when destroyed', () => {
        it(
            'should not schedule a new check for update (after current check)',
            fakeAsync(
                run(() => {
                    appRef.isStable.next(true);
                    expect(swu.checkForUpdate).toHaveBeenCalled();

                    service.ngOnDestroy();
                    swu.checkForUpdate.calls.reset();

                    tick(checkInterval);
                    tick(checkInterval);

                    expect(swu.checkForUpdate).not.toHaveBeenCalled();
                })
            )
        );

        it(
            'should not schedule a new check for update (after activating an update)',
            fakeAsync(
                run(() => {
                    appRef.isStable.next(true);
                    expect(swu.checkForUpdate).toHaveBeenCalled();

                    service.ngOnDestroy();
                    swu.checkForUpdate.calls.reset();

                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);

                    tick(checkInterval);
                    tick(checkInterval);

                    expect(swu.checkForUpdate).not.toHaveBeenCalled();
                })
            )
        );

        it(
            'should not activate available updates',
            fakeAsync(
                run(() => {
                    service.ngOnDestroy();
                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);

                    expect(swu.activateUpdate).not.toHaveBeenCalled();
                })
            )
        );

        it(
            'should stop emitting on `updateActivated`',
            fakeAsync(
                run(() => {
                    let activatedCount = 0;
                    service.updateActivated.subscribe(() => activatedCount++);

                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                    flushMicrotasks();

                    expect(activatedCount).toEqual(1);

                    service.ngOnDestroy();
                    swu.versionUpdates.next({ type: 'VERSION_READY' } as VersionEvent);
                    flushMicrotasks();

                    expect(activatedCount).toEqual(1);
                })
            )
        );
    });
});

// Mocks
class MockApplicationRef {
    isStable = new Subject<boolean>();
}

class MockLogger {
    log = jasmine.createSpy('MockLogger.log');
}

class MockSwUpdate {
    versionUpdates = new Subject<VersionEvent>();

    activateUpdate = jasmine
        .createSpy('MockSwUpdate.activateUpdate')
        .and.callFake(() => Promise.resolve(true));

    checkForUpdate = jasmine
        .createSpy('MockSwUpdate.checkForUpdate')
        .and.callFake(() => Promise.resolve());

    constructor(public isEnabled: boolean) {}
}
