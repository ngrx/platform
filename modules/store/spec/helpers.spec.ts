import { capitalize, uncapitalize } from '../src/helpers';

describe('helpers', () => {
  describe('capitalize', () => {
    it('should capitalize the text', () => {
      expect(capitalize('ngrx')).toEqual('Ngrx');
    });

    it('should return an empty string when the text is an empty string', () => {
      expect(capitalize('')).toEqual('');
    });
  });

  describe('uncapitalize', () => {
    it('should uncapitalize the text', () => {
      expect(uncapitalize('NGRX')).toEqual('nGRX');
    });

    it('should return an empty string when the text is an empty string', () => {
      expect(uncapitalize('')).toEqual('');
    });
  });
});
