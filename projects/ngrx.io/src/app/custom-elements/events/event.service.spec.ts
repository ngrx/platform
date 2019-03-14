import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { Event, EventResponse } from './event.model';

describe('EventService', () => {
  let injector: Injector;
  let eventService: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService],
    });

    eventService = injector.get<EventService>(EventService);
    eventService.currentDate = new Date('01-02-2019');
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should make a single connection to the server', () => {
    const req = httpMock.expectOne({});
    expect(req.request.url).toBe('generated/events.json');
  });

  describe('#events', () => {
    let upcomingEvents: Event[];
    let pastEvents: Event[];
    let testData: EventResponse[];

    beforeEach(() => {
      testData = getTestEventResponse();
      httpMock.expectOne({}).flush(testData);
      eventService.upcomingEvents$.subscribe(results => (upcomingEvents = results));
      eventService.pastEvents$.subscribe(results => (pastEvents = results));
    });

    it('upcomingEvents observable should complete', () => {
      let completed = false;
      eventService.upcomingEvents$.subscribe(
        undefined,
        undefined,
        () => (completed = true)
      );
      expect(completed).toBe(true, 'observable completed');
    });

    it('pastEvents observable should complete', () => {
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

      it('should correct set the date range', () => {
        expect(upcomingEvents[0].dateRangeString).toEqual('January 1 - 3, 2019');
        expect(upcomingEvents[1].dateRangeString).toEqual('April 1, 2019');
        expect(upcomingEvents[2].dateRangeString).toEqual('April 2, 2019');
      });
    });

    describe('past events', () => {
      it('should emit', () => {
        expect(pastEvents.length).toEqual(2)
      });

      it('should correct set the date range', () => {
        expect(pastEvents[0].dateRangeString).toEqual('June 28 - July 1, 2018');
        expect(pastEvents[1].dateRangeString).toEqual('December 25, 2018 - January 1, 2019');
      });
    });

    // it('should reshape the contributor json to expected result', () => {
    //   const groupNames = contribs.map(g => g.name).join(',');
    //   expect(groupNames).toEqual('Angular,GDE');
    // });

    // it('should have expected "GDE" contribs in order', () => {
    //   const gde = contribs[1];
    //   const actualAngularNames = gde.contributors.map(l => l.name).join(',');
    //   const expectedAngularNames = [testData.jeffcross, testData.kapunahelewong]
    //     .map(l => l.name)
    //     .join(',');
    //   expect(actualAngularNames).toEqual(expectedAngularNames);
    // });
  });

  it('should do WHAT(?) if the request fails');
});

function getTestEventResponse(): EventResponse[] {
  return [
    {
      name: 'conf1',
      url: '',
      location: '',
      startDate: '06-28-2018',
      endDate: '07-01-2018'
    },
    {
      name: 'conf2',
      url: '',
      location: '',
      startDate: '12-25-2018',
      endDate: '01-01-2019'
    },
    {
      name: 'conf3',
      url: '',
      location: '',
      startDate: '01-01-2019',
      endDate: '01-03-2019'
    },
    {
      name: 'conf4',
      url: '',
      location: '',
      endDate: '04-01-2019'
    },
    {
      name: 'conf5',
      url: '',
      location: '',
      startDate: '04-02-2019',
      endDate: '04-02-2019'
    },
  ];
}
