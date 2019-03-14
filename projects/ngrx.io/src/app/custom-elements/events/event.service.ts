import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectableObservable, Observable } from 'rxjs';
import { publishLast, map } from 'rxjs/operators';
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
import { EventResponse, Event } from './event.model';

const resourcesPath = CONTENT_URL_PREFIX + 'events.json';

@Injectable()
export class EventService {
  currentDate: Date;
  private events$: Observable<Event[]>;
  upcomingEvents$: Observable<Event[]>;
  pastEvents$: Observable<Event[]>;

  constructor(private http: HttpClient) {
    this.currentDate = new Date();
    // Compare soley on date, without factoring in time.
    this.currentDate.setHours(0, 0, 0, 0);
    this.events$ = this.getEvents();
    this.upcomingEvents$ = this.events$.pipe(
      map(events =>
        events.filter(event => event.endDate >= this.currentDate)
      )
    );
    this.pastEvents$ = this.events$.pipe(
      map(events =>
        events.filter(event => event.endDate < this.currentDate)
      )
    );
  }

  /**
   * Fetch Event JSON from file and return an Observable that emits an Event array.
   */
  private getEvents(): Observable<Event[]> {
    const events = this.http.get<EventResponse[]>(resourcesPath).pipe(
      map(eventResponses =>
        eventResponses.map(eventResponse => {
          const startDate = eventResponse.startDate ? new Date(eventResponse.startDate) : undefined;
          const endDate = new Date(eventResponse.endDate);
          const event: Event = {
            ...eventResponse,
            startDate,
            endDate,
            dateRangeString: getDateRange(startDate, endDate)
          };
          return event;
        })
      ),
      publishLast(),
    );

    (events as ConnectableObservable<Event[]>).connect();
    return events;
  };
}

/**
   * The date range string for the two given dates
   * '01-01-2019' until '01-01-2019' -> 'January 1, 2019'
   * '01-01-2019' until '01-02-2019' -> 'January 1 - 2, 2019'
   * '01-28-2019' until '02-01-2019' -> 'January 28 - February 1, 2019'
   * '12-31-2018' until '01-01-2019' -> 'December 31, 2018 - January 1, 2019'
   * @param startDate date the event starts.  If undefined, startDate assumed to be same as endDate.
   * @param endDate date theh event ends.
   */
function getDateRange(startDate: Date | undefined, endDate: Date): string {
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
