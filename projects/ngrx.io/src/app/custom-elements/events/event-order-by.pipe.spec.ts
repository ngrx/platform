import { Event } from './event.model';
import { EventOrderByPipe } from './event-order-by.pipe';

describe('Pipe: Event Order By', () => {
    let pipe: EventOrderByPipe;

    beforeEach(() => {
        pipe = new EventOrderByPipe();
    });

    it('should return an empty array if the passed events array is null', () => {
        expect(pipe.transform(null, 'ascending')).toEqual([]);
    });

    describe('ascending', () => {
        it('should order an event with an earlier startDate before an event with a later startDate, '
      + 'regardless of endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2019-01-04')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-02'),
                endDate: new Date('2019-01-03')
            };

            expect(pipe.transform([laterEvent, earlierEvent], 'ascending')).toEqual([earlierEvent, laterEvent]);
        });

        it('should order an event with only an endDate before an event with a startDate '
      + 'if the first events endDate is before the second events startDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-03'),
                endDate: new Date('2019-01-04')
            };

            expect(pipe.transform([laterEvent, earlierEvent], 'ascending')).toEqual([earlierEvent, laterEvent]);
        });

        it('should order an event with a startDate before an event with only an endDate '
      + 'if the first events startDate is before the second events endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2019-01-03')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            expect(pipe.transform([laterEvent, earlierEvent], 'ascending')).toEqual([earlierEvent, laterEvent]);
        });

        it('should order an event with only an endDate before an event with only an endDate '
      + 'if the first events endDate is before the second events endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-01')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            expect(pipe.transform([laterEvent, earlierEvent], 'ascending')).toEqual([earlierEvent, laterEvent]);
        });
    });

    describe('descending', () => {
        it('should order an event with an earlier startDate after an event with a later startDate, '
      + 'regardless of endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2019-01-04')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-02'),
                endDate: new Date('2019-01-03')
            };

            expect(pipe.transform([earlierEvent, laterEvent], 'descending')).toEqual([laterEvent, earlierEvent]);
        });

        it('should order an event with only an endDate after an event with a startDate '
      + 'if the first events endDate is before the second events startDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-03'),
                endDate: new Date('2019-01-04')
            };

            expect(pipe.transform([earlierEvent, laterEvent], 'descending')).toEqual([laterEvent, earlierEvent]);
        });

        it('should order an event with a startDate after an event with only an endDate '
      + 'if the first events startDate is before the second events endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                startDate: new Date('2019-01-01'),
                endDate: new Date('2019-01-03')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            expect(pipe.transform([earlierEvent, laterEvent], 'descending')).toEqual([laterEvent, earlierEvent]);
        });

        it('should order an event with only an endDate after an event with only an endDate '
      + 'if the first events endDate is before the second events endDate', () => {
            const earlierEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-01')
            };

            const laterEvent: Event = {
                name: '',
                url: '',
                location: '',
                endDate: new Date('2019-01-02')
            };

            expect(pipe.transform([earlierEvent, laterEvent], 'descending')).toEqual([laterEvent, earlierEvent]);
        });
    });
});
