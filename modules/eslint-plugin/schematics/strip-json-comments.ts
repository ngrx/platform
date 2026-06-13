export function stripJsonComments(json: string): string {
  let result = '';
  let inString = false;
  let inSingleComment = false;
  let inMultiComment = false;

  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    const next = json[i + 1];

    if (inSingleComment) {
      if (char === '\n') {
        inSingleComment = false;
        result += char;
      }
      continue;
    }

    if (inMultiComment) {
      if (char === '*' && next === '/') {
        inMultiComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      result += char;
      if (char === '\\') {
        result += next;
        i++;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === '/' && next === '/') {
      inSingleComment = true;
      i++;
      continue;
    }

    if (char === '/' && next === '*') {
      inMultiComment = true;
      i++;
      continue;
    }

    result += char;
  }

  return result;
}
