# generateFrames

Observable creation functions helpful in environments with patched global APIs like zone.js environments where you can't use RxJSs `animationFrames`.

<figure>
<img src="generated/images/guide/component/generateFrames.png" alt="generateFrames Marble Diagram" width="100%" height="100%" />
</figure>

## Description 

Like `animationFrames` this function returns an observable emitting the passed milliseconds with every animationFrame starting from the moment of subscription.
In comparison to `animationFrames`, `generateFrames` is more generic and is able to take `animationFrame`, `setInterval`, `setTimeout` PromiseLike things, etc.

This is especially helpful in environments where global APIs are patched by libraries like zone.js. 
Using this operator can ensure we use an un-patched version of the API.

## Signature

```typescript
export function generateFrames(
asyncProducer: asyncProducerFn,
asyncCanceler: asyncCancelerFn,
timestampProvider: TimestampProvider = Date
): Observable<number>;
```

## Usage
This operator is normally used to get the zone un-patched animationFrame as observable. 

**Problem**
```typescript
import {animationFrames,Observable} from 'rxjs';
// Animation frame DOES triggers zone
const afPatched$: Observable<number> =  animationFrames();
```

**Solution**
```typescript
import {Observable} from 'rxjs';
import {generateFrames, asyncProducerFn, asyncCancelerFn} from '@ngrx/component';

// Animation frame DOES NOT triggers zone
const asyncProducer: asyncProducerFn = window['__zone_symbol__requestAnimationFrame'];
const asyncCanceler: asyncCancelerFn = window['__zone_symbol__cancelAnimationFrame'];

const afUnpatched$: Observable<number> =  generateFrames(asyncProducer,asyncCanceler);
```
