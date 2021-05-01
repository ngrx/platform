import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { of } from 'rxjs';
import { EventService } from './event.service';
import { Event } from './event.model';
import { EventDateRangePipe } from './event-date-range.pipe';
import { EventOrderByPipe } from './event-order-by.pipe';

const mockUpcomingEvents: Event[] = [
    {
        name: 'NG-Rome',
        url: 'https://ngrome.io/',
        location: 'Rome, Italy',
        endDate: new Date('2019-10-07')
    }
];

const mockPastEvents: Event[] = [
    {
        name: 'DevFestATL',
        url: 'http://devfestatl.com',
        location: 'Atlanta, Georgia',
        endDate: new Date('2018-09-22')
    }
];

class TestEventService {
    upcomingEvents$ = of(mockUpcomingEvents);
    pastEvents$ = of(mockPastEvents);
}

describe('Event List Component', () => {

    let fixture: ComponentFixture<EventListComponent>;
    let component: EventListComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ EventListComponent, EventDateRangePipe, EventOrderByPipe ],
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
