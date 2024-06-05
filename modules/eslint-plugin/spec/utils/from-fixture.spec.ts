import { fromFixture } from './from-fixture';

describe('fromFixture', () => {
  it('should create an invalid test with a message ID', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [whoops]`
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
      },
    ]);
  });

  it('should create an invalid test with options', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [whoops]`,
      {
        filename: 'test.ts',
        output: `
const name = 'alice';`,
      }
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
      },
    ]);
    expect(test).toHaveProperty('filename', 'test.ts');
    expect(test).toHaveProperty(
      'output',
      `
const name = 'alice';`
    );
  });

  it('should create an invalid test with multiple errors', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [first]
      ~~~~ [second]
const role = 'engineer';
~~~~~ [third]`
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'first',
      },
      {
        column: 7,
        data: {},
        endColumn: 11,
        endLine: 2,
        line: 2,
        messageId: 'second',
      },
      {
        column: 1,
        data: {},
        endColumn: 6,
        endLine: 3,
        line: 3,
        messageId: 'third',
      },
    ]);
  });

  it('should create an invalid test with data', () => {
    const test = fromFixture(
      `
const name = "alice";
      ~~~~ [whoops { "identifier": "name" }]`
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 7,
        data: {
          identifier: 'name',
        },
        endColumn: 11,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
      },
    ]);
  });

  it('should support data that contains punctuation', () => {
    const punctuation = '[]{}()';
    const test = fromFixture(
      `
const name = "alice";
      ~~~~ [whoops { "value": "${punctuation}" }]`
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 7,
        data: {
          value: punctuation,
        },
        endColumn: 11,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
      },
    ]);
  });

  it('should create an invalid test with a suggestion', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [whoops suggest]`,
      {
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
        ],
      }
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
        ],
      },
    ]);
    expect(test).not.toHaveProperty('suggestions');
  });

  it('should create an invalid test with multiple suggestions', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [whoops suggest]`,
      {
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
          {
            messageId: 'wat',
            output: `
              const name = "eve";
            `,
          },
        ],
      }
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
          {
            messageId: 'wat',
            output: `
              const name = "eve";
            `,
          },
        ],
      },
    ]);
    expect(test).not.toHaveProperty('suggestions');
  });

  it('should create an invalid test with multiple errors with suggestions', () => {
    const test = fromFixture(
      `
const name = "alice";
             ~~~~~~~ [whoops suggest 0]
             ~~~~~~~ [whoops { "identifier": "name" } suggest 1 2]
             ~~~~~~~ [whoops]`,
      {
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
          {
            messageId: 'wat',
            output: `
              const name = "eve";
            `,
          },
          {
            messageId: 'wat',
            output: `
              const name = "mallory";
            `,
          },
        ],
      } as const
    );
    expect(test).toHaveProperty('code');
    expect(test).toHaveProperty('errors');
    expect(test.errors).toEqual([
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "bob";
            `,
          },
        ],
      },
      {
        column: 14,
        data: { identifier: 'name' },
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
        suggestions: [
          {
            messageId: 'wat',
            output: `
              const name = "eve";
            `,
          },
          {
            messageId: 'wat',
            output: `
              const name = "mallory";
            `,
          },
        ],
      },
      {
        column: 14,
        data: {},
        endColumn: 21,
        endLine: 2,
        line: 2,
        messageId: 'whoops',
      },
    ]);
    expect(test).not.toHaveProperty('suggestions');
  });

  it('should throw if suggestions are not annotated', () => {
    expect(() =>
      fromFixture(
        `
const name = "alice";
              ~~~~~~~ [whoops]`,
        {
          suggestions: [
            {
              messageId: 'wat',
              output: `
              const name = "bob";
            `,
            },
          ],
        }
      )
    ).toThrow(/no 'suggest' annotation found/);
  });
});
