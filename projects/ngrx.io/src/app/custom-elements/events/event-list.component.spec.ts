import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { of } from 'rxjs';
import { EventService } from './event.service';

class TestEventService {
  upcomingEvents$ = of();
  pastEvents$ = of();
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
});
