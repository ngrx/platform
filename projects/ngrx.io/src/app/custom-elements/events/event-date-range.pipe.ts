import { Pipe, PipeTransform } from '@angular/core';
import { Event } from './event.model';

/**
 * Transforms the startDate and endDate for a given event into a dange range string.
 * undefined until '01-01-2019' -> 'January 1, 2019'
 * '01-01-2019' until '01-01-2019' -> 'January 1, 2019'
 * '01-01-2019' until '01-02-2019' -> 'January 1 - 2, 2019'
 * '01-28-2019' until '02-01-2019' -> 'January 28 - February 1, 2019'
 * '12-31-2018' until '01-01-2019' -> 'December 31, 2018 - January 1, 2019'
 */
@Pipe({name: 'eventDateRange'})
export class EventDateRangePipe implements PipeTransform {
    transform(event: Event): string {
        const startDate = event.startDate;
        const endDate = event.endDate;
        if (!startDate || startDate.getTime() === endDate.getTime()) {
            return getDateString(endDate);
        } else {
            if (getMonth(startDate) === getMonth(endDate) && getYear(startDate) === getYear(endDate)) {
                return getMonth(startDate)
          + ' ' + getDay(startDate) + ' - ' + getDay(endDate)
          + ', ' + getYear(startDate);
            } else if (getYear(startDate) === getYear(endDate)) {
                return getMonth(startDate)
          + ' ' + getDay(startDate)
          + ' - ' + getMonth(endDate)
          + ' ' + getDay(endDate)
          + ', ' + getYear(startDate);
            } else {
                return getDateString(startDate)
          + ' - ' + getDateString(endDate);
            }
        }
    }
}

const getDay = (date: Date) => date.getUTCDate();
const getMonth = (date: Date) => months[date.getUTCMonth()];
const getYear = (date: Date) => date.getUTCFullYear();
const getDateString = (date: Date) => getMonth(date) + ' ' + getDay(date) + ', ' + getYear(date);
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
