import { EventDateRangePipe } from './event-date-range.pipe';
import { Event } from './event.model';

describe('Pipe: Event Date Range', () => {
    let pipe: EventDateRangePipe;

    beforeEach(() => {
        pipe = new EventDateRangePipe();
    });

    it('providing no startDate should format only the endDate in MM DD, YYYY', () => {
        const event: Event = {
            name: '',
            url: '',
            location: '',
            endDate: new Date('2019-01-01')
        };
        expect(pipe.transform(event)).toBe('January 1, 2019');
    });

    it('providing the same startDate and endDate should format only one in MM DD, YYYY', () => {
        const event: Event = {
            name: '',
            url: '',
            location: '',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-01-01')
        };
        expect(pipe.transform(event)).toBe('January 1, 2019');
    });

    it('providing different days in the same month and year should format in MM DD - DD, YYYY format', () => {
        const event: Event = {
            name: '',
            url: '',
            location: '',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-01-02')
        };
        expect(pipe.transform(event)).toBe('January 1 - 2, 2019');
    });

    it('providing different days and months in the same year should format in MM DD - MM DD, YYYY format', () => {
        const event: Event = {
            name: '',
            url: '',
            location: '',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2019-01-02')
        };
        expect(pipe.transform(event)).toBe('January 1 - 2, 2019');
    });

    it('providing different days, months, and years should format in MM DD, YYYY - MM DD, YYYY format', () => {
        const event: Event = {
            name: '',
            url: '',
            location: '',
            startDate: new Date('2018-12-31'),
            endDate: new Date('2019-01-01')
        };
        expect(pipe.transform(event)).toBe('December 31, 2018 - January 1, 2019');
    });
});
