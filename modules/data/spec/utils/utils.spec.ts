import { CorrelationIdGenerator } from '../../';

describe('Utilities (utils)', () => {
  describe('CorrelationIdGenerator', () => {
    const prefix = 'CRID';

    it('generates a non-zero integer id', () => {
      const generator = new CorrelationIdGenerator();
      const id = generator.next();
      expect(id).toBe(prefix + 1);
    });

    it('generates successive integer ids', () => {
      const generator = new CorrelationIdGenerator();
      const id1 = generator.next();
      const id2 = generator.next();
      expect(id1).toBe(prefix + 1);
      expect(id2).toBe(prefix + 2);
    });

    it('new instance of the service has its own ids', () => {
      const generator1 = new CorrelationIdGenerator();
      const generator2 = new CorrelationIdGenerator();
      const id1 = generator1.next();
      const id2 = generator1.next();
      const id3 = generator2.next();
      expect(id1).toBe(prefix + 1);
      expect(id2).toBe(prefix + 2);
      expect(id3).toBe(prefix + 1);
    });
  });
});
