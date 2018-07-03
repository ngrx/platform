import * as ngCore from '@angular/core';
import { selectIdValue } from '../src/utils';
import { BookModel } from './fixtures/book';

describe('Entity utils', () => {
  describe(`selectIdValue()`, () => {
    it('should not warn when key does exist', () => {
      const spy = spyOn(console, 'warn');

      const book: BookModel = { id: 'PC', title: 'Purple Cow' };
      const key = selectIdValue(book, b => b.id);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when key does not exist in dev mode', () => {
      const spy = spyOn(console, 'warn');

      const book: BookModel = { id: 'PC', title: 'Purple Cow' };
      const key = selectIdValue(book, (b: any) => b.foo);

      expect(spy).toHaveBeenCalled();
    });

    it('should not warn when key does not exist in prod mode', () => {
      spyOn(ngCore, 'isDevMode').and.returnValue(false);
      const spy = spyOn(console, 'warn');

      const book: BookModel = { id: 'PC', title: 'Purple Cow' };
      const key = selectIdValue(book, (b: any) => b.foo);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
