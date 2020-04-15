import * as _ from 'lodash';

function stringify(x: any): string {
  return JSON.stringify(x, function(key: string, value: any) {
    if (Array.isArray(value)) {
      return (
        '[' +
        value.map(function(i) {
          return '\n\t' + stringify(i);
        }) +
        '\n]'
      );
    }
    return value;
  })
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n');
}

function deleteErrorNotificationStack(marble: any) {
  const { notification } = marble;
  if (notification) {
    const { kind, error } = notification;
    if (kind === 'E' && error instanceof Error) {
      notification.error = { name: error.name, message: error.message };
    }
  }
  return marble;
}

export function defaultAssert(value: any, message: string): void {
  if (value) {
    return;
  }
  throw new Error(message);
}

export function observableMatcher(
  assert: (a: any, e: any) => void,
  assertDeepEqual: (a: any, e: any) => void
): (actual: any, expected: any) => void {
  return (actual: any, expected: any) => {
    if (Array.isArray(actual) && Array.isArray(expected)) {
      actual = actual.map(deleteErrorNotificationStack);
      expected = expected.map(deleteErrorNotificationStack);

      const passed = _.isEqual(actual, expected);
      if (passed) {
        return;
      }

      let message = '\nExpected \n';
      actual.forEach((x: any) => (message += `\t${stringify(x)}\n`));

      message += '\t\nto deep equal \n';
      expected.forEach((x: any) => (message += `\t${stringify(x)}\n`));
      assert(passed, message);
    } else {
      assertDeepEqual(actual, expected);
    }
  };
}
