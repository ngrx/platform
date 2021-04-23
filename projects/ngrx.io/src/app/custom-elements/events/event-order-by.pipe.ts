import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './event.model';

type EventOrderBy = 'ascending' | 'descending';

/**
 * Transforms the events to sorted ascending or descending order by date.
 * If an event has a startDate, order based on it.  If not, use it's endDate.
 */
@Pipe({name: 'eventOrderBy'})
export class EventOrderByPipe implements PipeTransform {
    transform(events: Event[] | null, orderBy: EventOrderBy): Event[] {
        if (events === null) {
            return [];
        }
        switch (orderBy) {
            case 'ascending': {
                return events.sort((eventOne, eventTwo) => +(eventOne.startDate || eventOne.endDate) - +(eventTwo.startDate || eventTwo.endDate));
            }
            case 'descending': {
                return events.sort((eventOne, eventTwo) => +(eventTwo.startDate || eventTwo.endDate) - +(eventOne.startDate || eventOne.endDate));
            }
        }
    }
}
