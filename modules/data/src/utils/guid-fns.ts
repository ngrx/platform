/**
  Client-side id-generators

  These GUID utility functions are not used by @ngrx/data itself at this time.
  They are included as candidates for generating persistable correlation ids if that becomes desirable.
  They are also safe for generating unique entity ids on the client.

  Note they produce 32-character hexadecimal UUID strings,
  not the 128-bit representation found in server-side languages and databases.

  These utilities are experimental and may be withdrawn or replaced in future.
*/

/**
 * Creates a Universally Unique Identifier (AKA GUID)
 */
function getUuid() {
  // The original implementation is based on this SO answer:
  // http://stackoverflow.com/a/2117523/200253
  return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Alias for getUuid(). Compare with getGuidComb(). */
export function getGuid() {
  return getUuid();
}

/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part
 */
export function getGuidComb(seed?: number) {
  // Each new Guid is greater than next if more than 1ms passes
  // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
  // Based on breeze.core.getUuid which is based on this StackOverflow answer
  // http://stackoverflow.com/a/2117523/200253
  //
  // Convert time value to hex: n.toString(16)
  // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
  // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
  //
  // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
  const timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(
    -12
  );
  return (
    'xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, function (c) {
      /* eslint-disable no-bitwise */
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) + timePart
  );
}

// Sort comparison value that's good enough
export function guidComparer(l: string, r: string) {
  const lLow = l.slice(-12);
  const rLow = r.slice(-12);
  return lLow !== rLow
    ? lLow < rLow
      ? -1
      : +(lLow !== rLow)
    : l < r
    ? -1
    : +(l !== r);
}
