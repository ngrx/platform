import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConnectableObservable, Observable } from 'rxjs';
import { publishLast, map } from 'rxjs/operators';
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
import { EventResponse, Event } from './event.model';

const eventsPath = CONTENT_URL_PREFIX + 'events.json';

@Injectable()
export class EventService {
    currentDate: Date;
    private events$: Observable<Event[]>;
    upcomingEvents$: Observable<Event[]>;
    pastEvents$: Observable<Event[]>;

    constructor(private http: HttpClient) {
        const now = new Date();
        // Compare soley on UTC date, without factoring in time.
        this.currentDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
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
        const events = this.http.get<EventResponse[]>(eventsPath).pipe(
            map(eventResponses =>
                eventResponses.map(eventResponse => {
                    const event: Event = {
                        ...eventResponse,
                        startDate: eventResponse.startDate ? new Date(eventResponse.startDate) : undefined,
                        endDate: new Date(eventResponse.endDate)
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
