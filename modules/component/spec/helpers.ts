export function stripSpaces(str: string): string {
  return str.replace(/[\n\r\s]+/g, '');
}

export function wrapWithSpace(str: string): string {
  return ' ' + str + ' ';
}
