import { Component } from '@angular/core';
import { Event } from './event.model';
import { EventService } from './event.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'aio-event-list',
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
        <tr *ngFor="let upcomingEvent of upcomingEvents$ | async | eventOrderBy:'ascending'">
          <th><a [href]="upcomingEvent.url" [title]="upcomingEvent.name">{{upcomingEvent.name}}</a></th>
          <td>{{upcomingEvent.location}}</td>
          <td>{{upcomingEvent | eventDateRange}}</td>
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
        <tr *ngFor="let pastEvent of pastEvents$ | async | eventOrderBy:'descending'">
          <th><a [href]="pastEvent.url" [title]="pastEvent.name">{{pastEvent.name}}</a></th>
          <td>{{pastEvent.location}}</td>
          <td>{{pastEvent | eventDateRange}}</td>
        </tr>
      </tbody>
    </table>
`
})
export class EventListComponent {
    upcomingEvents$: Observable<Event[]> = this.eventService.upcomingEvents$;
    pastEvents$: Observable<Event[]> = this.eventService.pastEvents$;

    constructor(private eventService: EventService) { }
}
