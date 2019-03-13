import { ReflectiveInjector } from '@angular/core';
import { EventListComponent } from './event-list.component';
import { Event } from './event.model';

// Testing the component class behaviors, independent of its template
// Let e2e tests verify how it displays.
describe('EventListComponent', () => {

  let component: EventListComponent;
  let injector: ReflectiveInjector;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      EventListComponent
    ]);
  });

  it('should put each event into the correct bucket and correctly format the date range string', () => {
    component = getComponent();
    component.currentDate = new Date('01-02-2019');
    const mockEvents: Event[] = [
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
    component.events = mockEvents;
    expect(component.pastEvents.length).toEqual(2);
    expect(component.upcomingEvents.length).toEqual(3);
    expect(component.pastEvents[0].dateRangeString).toEqual('June 28 - July 1, 2018');
    expect(component.pastEvents[1].dateRangeString).toEqual('December 25, 2018 - January 1, 2019');
    expect(component.upcomingEvents[0].dateRangeString).toEqual('January 1 - 3, 2019');
    expect(component.upcomingEvents[1].dateRangeString).toEqual('April 1, 2019');
    expect(component.upcomingEvents[2].dateRangeString).toEqual('April 2, 2019');
  });


  //// Test Helpers ////
  function  getComponent(): EventListComponent {
    const comp = injector.get(EventListComponent);
    return comp;
  }
});
