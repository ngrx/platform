import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConnectableObservable, Observable } from 'rxjs';
import { tap, publishLast, map } from 'rxjs/operators';

import { CONTENT_URL_PREFIX } from 'app/documents/document.service';
import { Event } from './event.model';

const resourcesPath = CONTENT_URL_PREFIX + 'events.json';

@Injectable()
export class EventService {
  events: Observable<Event[]>;

  constructor(private http: HttpClient) {
    this.events = this.getEvents();
  }

  private getEvents(): Observable<Event[]> {
    console.log('getEvents')
    const events = this.http.get<any>(resourcesPath).pipe(
      tap(() => console.log('serviceok')),
      map(event => event as Event[]),
      tap(event => console.log('service: ' + event)),
      publishLast(),
    );

    (events as ConnectableObservable<Event[]>).connect();
    return events;
  };
}
