import { TestBed } from '@angular/core/testing';

import { DefaultPluralizer, Pluralizer, PLURAL_NAMES_TOKEN } from '../../';

describe('DefaultPluralizer', () => {
  describe('without plural names', () => {
    let pluralizer: Pluralizer;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: Pluralizer, useClass: DefaultPluralizer }],
      });

      pluralizer = TestBed.inject(Pluralizer);
    });
    it('should turn "Hero" to "Heros" because no plural names map', () => {
      // No map so 'Hero' gets default pluralization
      expect(pluralizer.pluralize('Hero')).toBe('Heros');
    });

    it('should pluralize "Villain" which is not in plural names', () => {
      // default pluralization with 's'
      expect(pluralizer.pluralize('Villain')).toBe('Villains');
    });

    it('should pluralize "consonant + y" with "-ies"', () => {
      expect(pluralizer.pluralize('Company')).toBe('Companies');
    });

    it('should pluralize "vowel + y" with "-es"', () => {
      expect(pluralizer.pluralize('Cowboy')).toBe('Cowboys');
    });

    it('should pluralize "Information" as "Information ', () => {
      // known "uncoumtables"
      expect(pluralizer.pluralize('Information')).toBe('Information');
    });

    it('should pluralize "SkyBox" which is not in plural names', () => {
      // default pluralization of word ending in 'x'
      expect(pluralizer.pluralize('SkyBox')).toBe('SkyBoxes');
    });
  });

  describe('with injected plural names', () => {
    let pluralizer: Pluralizer;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          // Demonstrate multi-provider
          // Default would turn "Hero" into "Heros". Fix it.
          {
            provide: PLURAL_NAMES_TOKEN,
            multi: true,
            useValue: { Hero: 'Heroes' },
          },
          // "Foots" is deliberately wrong. Count on override in next provider
          {
            provide: PLURAL_NAMES_TOKEN,
            multi: true,
            useValue: { Foot: 'Foots' },
          },
          // Demonstrate overwrite of 'Foot' while setting multiple names
          {
            provide: PLURAL_NAMES_TOKEN,
            multi: true,
            useValue: { Foot: 'Feet', Person: 'People' },
          },
          { provide: Pluralizer, useClass: DefaultPluralizer },
        ],
      });

      pluralizer = TestBed.inject(Pluralizer);
    });

    it('should pluralize "Villain" which is not in plural names', () => {
      // default pluralization with 's'
      expect(pluralizer.pluralize('Villain')).toBe('Villains');
    });

    it('should pluralize "Hero" using plural names', () => {
      expect(pluralizer.pluralize('Hero')).toBe('Heroes');
    });

    it('should be case sensitive when using map', () => {
      // uses default pluralization rule, not the names map
      expect(pluralizer.pluralize('hero')).toBe('heros');
    });

    it('should pluralize "Person" using a plural name added to the map later', () => {
      expect(pluralizer.pluralize('Person')).toBe('People');
    });

    it('later plural name map replaces earlier one', () => {
      expect(pluralizer.pluralize('Foot')).toBe('Feet');
    });
  });
});
