import { capitalize } from '../src/helpers';

describe('helpers', () => {
  describe('capitalize', () => {
    it('should capitalize the text', () => {
      expect(capitalize('ngrx')).toEqual('Ngrx');
    });

    it('should return an empty string when the text is an empty string', () => {
      expect(capitalize('')).toEqual('');
    });
  });
});
