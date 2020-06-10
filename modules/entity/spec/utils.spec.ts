import * as ngCore from '@angular/core';
import { selectIdValue } from '../src/utils';
import { BookModel, AClockworkOrange } from './fixtures/book';

describe('Entity utils', () => {
  describe(`selectIdValue()`, () => {
    it('should not warn when key does exist', () => {
      const spy = spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book) => book.id);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when key does not exist in dev mode', () => {
      const spy = spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book: any) => book.foo);

      expect(spy).toHaveBeenCalled();
    });

    it('should warn when key is undefined in dev mode', () => {
      const spy = spyOn(console, 'warn');

      const undefinedAClockworkOrange = { ...AClockworkOrange, id: undefined };
      const key = selectIdValue(
        undefinedAClockworkOrange,
        (book: any) => book.id
      );

      expect(spy).toHaveBeenCalled();
    });

    it('should not warn when key does not exist in prod mode', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);
      const spy = spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book: any) => book.foo);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not warn when key is undefined in prod mode', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);
      const spy = spyOn(console, 'warn');

      const undefinedAClockworkOrange = { ...AClockworkOrange, id: undefined };
      const key = selectIdValue(
        undefinedAClockworkOrange,
        (book: any) => book.id
      );

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
