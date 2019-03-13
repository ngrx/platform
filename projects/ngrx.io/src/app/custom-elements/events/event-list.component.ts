import { Component, Input } from '@angular/core';
import { Event, DisplayEvent } from './event.model';

@Component({
  selector: `aio-event-list`,
  template: `
    <p>Upcoming Events presenting about NgRx:</p>
    <table class="is-full-width">
      <thead>
        <tr>
          <th>Event</th>
          <th>Location</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let upcomingEvent of upcomingEvents">
          <th><a [href]="upcomingEvent.url" [title]="upcomingEvent.name">{{upcomingEvent.name}}</a></th>
          <td>{{upcomingEvent.location}}</td>
          <td>{{upcomingEvent.dateRangeString}}</td>
        </tr>
      </tbody>
    </table>
    <p>Past Events:</p>
    <table class="is-full-width">
      <thead>
        <tr>
          <th>Event</th>
          <th>Location</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let pastEvent of pastEvents">
          <th><a [href]="pastEvent.url" [title]="pastEvent.name">{{pastEvent.name}}</a></th>
          <td>{{pastEvent.location}}</td>
          <td>{{pastEvent.dateRangeString}}</td>
        </tr>
      </tbody>
    </table>
`
})
export class EventListComponent {
  upcomingEvents: DisplayEvent[];
  pastEvents: DisplayEvent[];
  currentDate = new Date();

  @Input() set events(value: Event[]) {
    const displayEvents: DisplayEvent[] = value.map(event => {
      const startDate = event.startDate ? new Date(event.startDate) : undefined;
      const endDate = new Date(event.endDate);
      return {
        ...event,
        startDate,
        endDate,
        dateRangeString: EventListComponent.getDateRange(startDate, endDate)
      };
    });
    this.upcomingEvents = displayEvents.filter(event => event.endDate >= this.currentDate);
    this.pastEvents = displayEvents.filter(event => event.endDate < this.currentDate);
  }

  /**
   * The date range string for the two given dates
   * '01-01-2019' until '01-01-2019' -> 'January 1, 2019'
   * '01-01-2019' until '01-02-2019' -> 'January 1 - 2, 2019'
   * '01-28-2019' until '02-01-2019' -> 'January 28 - February 1, 2019'
   * '12-31-2018' until '01-01-2019' -> 'December 31, 2018 - January 1, 2019'
   * @param startDate
   * @param endDate
   */
  private static getDateRange(startDate: Date | undefined, endDate: Date): string {
    if (!startDate || startDate.getTime() === endDate.getTime()) {
      return endDate.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
    } else {
      if (startDate.getMonth() === endDate.getMonth()) {
        return startDate.toLocaleString('en-us', { month: 'long' })
          + ' ' + startDate.getUTCDate() + ' - ' + endDate.getUTCDate()
          + ', ' + startDate.getUTCFullYear();
      } else if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
        return startDate.toLocaleString('en-us', { month: 'long' })
          + ' ' + startDate.getUTCDate()
          + ' - ' + endDate.toLocaleString('en-us', { month: 'long' })
          + ' ' + endDate.getUTCDate()
          + ', ' + startDate.getUTCFullYear();
      } else {
        return startDate.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })
          + ' - ' + endDate.toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
  }
}
