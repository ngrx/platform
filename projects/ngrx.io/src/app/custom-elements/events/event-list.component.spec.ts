import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { of } from 'rxjs';
import { EventService } from './event.service';
import { Event } from './event.model';

const mockUpcomingEvents: Event[] = [
  {
    name: 'NG-Rome',
    url: 'https://ngrome.io/',
    location: 'Rome, Italy',
    endDate: new Date('10-07-2019'),
    dateRangeString: 'October 7, 2019'
  }
];

const mockPastEvents: Event[] = [
  {
    name: 'DevFestATL',
    url: 'http://devfestatl.com',
    location: 'Atlanta, Georgia',
    endDate: new Date('09-22-2018'),
    dateRangeString: 'September 22, 2018'
  }
];

class TestEventService {
  upcomingEvents$ = of(mockUpcomingEvents);
  pastEvents$ = of(mockPastEvents);
}

describe('EventListComponent', () => {

  let fixture: ComponentFixture<EventListComponent>;
  let component: EventListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ EventListComponent ],
      providers: [{ provide: EventService, useClass: TestEventService }]
    });

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the upcomingEvents', () => {
    component.upcomingEvents$.subscribe(events => expect(events).toEqual(mockUpcomingEvents));
  });

  it('should set the pastEvents', () => {
    component.pastEvents$.subscribe(events => expect(events).toEqual(mockPastEvents));
  });
});
