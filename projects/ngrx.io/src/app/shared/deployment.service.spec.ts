import { TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { LocationService } from 'app/shared/location.service';
import { MockLocationService } from 'testing/location.service';
import { Deployment } from './deployment.service';

describe('Deployment service', () => {
    describe('mode', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    Deployment,
                    { provide: LocationService, useFactory: () => new MockLocationService('') },
                ],
            });
        });

        it('should get the mode from the environment', () => {
            environment.mode = 'foo';
            const deployment = TestBed.inject(Deployment);
            expect(deployment.mode).toEqual('foo');
        });

        it('should get the mode from the `mode` query parameter if available', () => {
            const locationService: MockLocationService = TestBed.inject(
                LocationService
            ) as unknown as MockLocationService;
            locationService.search.and.returnValue({ mode: 'bar' });

            const deployment = TestBed.inject(Deployment);
            expect(deployment.mode).toEqual('bar');
        });
    });
});
