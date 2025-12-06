import { selectIdValue } from '../src/utils';
import { BookModel, AClockworkOrange } from './fixtures/book';

// Mock isDevMode at the top level - use a simple wrapper function
vi.mock('@angular/core', async () => {
  const actual =
    await vi.importActual<typeof import('@angular/core')>('@angular/core');
  return {
    ...actual,
    isDevMode: vi.fn(() => true),
  };
});

describe('Entity utils', () => {
  describe(`selectIdValue()`, () => {
    beforeEach(async () => {
      const { isDevMode } = await import('@angular/core');
      vi.mocked(isDevMode).mockReturnValue(true);
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not warn when key does exist', () => {
      const spy = vi.spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book) => book.id);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when key does not exist in dev mode', () => {
      const spy = vi.spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book: any) => book.foo);

      expect(spy).toHaveBeenCalled();
    });

    it('should warn when key is undefined in dev mode', () => {
      const spy = vi.spyOn(console, 'warn');

      const undefinedAClockworkOrange = { ...AClockworkOrange, id: undefined };
      const key = selectIdValue(
        undefinedAClockworkOrange,
        (book: any) => book.id
      );

      expect(spy).toHaveBeenCalled();
    });

    it('should not warn when key does not exist in prod mode', async () => {
      const { isDevMode } = await import('@angular/core');
      vi.mocked(isDevMode).mockReturnValue(false);
      const spy = vi.spyOn(console, 'warn');

      const key = selectIdValue(AClockworkOrange, (book: any) => book.foo);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not warn when key is undefined in prod mode', async () => {
      const { isDevMode } = await import('@angular/core');
      vi.mocked(isDevMode).mockReturnValue(false);
      const spy = vi.spyOn(console, 'warn');

      const undefinedAClockworkOrange = { ...AClockworkOrange, id: undefined };
      const key = selectIdValue(
        undefinedAClockworkOrange,
        (book: any) => book.id
      );

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
