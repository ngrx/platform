import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { Event, EventResponse } from './event.model';

describe('Event Service', () => {
    let injector: Injector;
    let eventService: EventService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        injector = TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EventService],
        });

        eventService = injector.get<EventService>(EventService);
        eventService.currentDate = new Date('2019-01-02');
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should make a single connection to the server', () => {
        const req = httpMock.expectOne({});
        expect(req.request.url).toBe('generated/events.json');
    });

    describe('events', () => {
        let upcomingEvents: Event[];
        let pastEvents: Event[];
        let testData: EventResponse[];

        beforeEach(() => {
            testData = getTestEventResponse();
            httpMock.expectOne({}).flush(testData);
            eventService.upcomingEvents$.subscribe(results => (upcomingEvents = results));
            eventService.pastEvents$.subscribe(results => (pastEvents = results));
        });

        it('upcomingEvents$ observable should complete', () => {
            let completed = false;
            eventService.upcomingEvents$.subscribe(
                undefined,
                undefined,
                () => (completed = true)
            );
            expect(completed).toBe(true, 'observable completed');
        });

        it('pastEvents$ observable should complete', () => {
            let completed = false;
            eventService.pastEvents$.subscribe(
                undefined,
                undefined,
                () => (completed = true)
            );
            expect(completed).toBe(true, 'observable completed');
        });

        describe('upcoming events', () => {
            it('should emit', () => {
                expect(upcomingEvents.length).toEqual(3)
            });
        });

        describe('past events', () => {
            it('should emit', () => {
                expect(pastEvents.length).toEqual(2)
            });
        });
    });
});

function getTestEventResponse(): EventResponse[] {
    return [
        {
            name: 'conf1',
            url: '',
            location: '',
            startDate: '2018-06-28',
            endDate: '2018-07-01'
        },
        {
            name: 'conf2',
            url: '',
            location: '',
            startDate: '2018-12-25',
            endDate: '2019-01-01'
        },
        {
            name: 'conf3',
            url: '',
            location: '',
            startDate: '2019-01-01',
            endDate: '2019-01-02'
        },
        {
            name: 'conf4',
            url: '',
            location: '',
            endDate: '2019-04-01'
        },
        {
            name: 'conf5',
            url: '',
            location: '',
            startDate: '2019-04-02',
            endDate: '2019-04-02'
        },
    ];
}
