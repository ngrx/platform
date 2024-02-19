import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { SinonSpy, fake } from 'sinon';
import { RxMethod } from 'modules/signals/rxjs-interop/src/rx-method';

/**
 * FakeRxMethod mock type, it's an extended version of RxMethod, with an additional
 * [FAKE_RX_METHOD] property containing a Sinon fake (SinonSpy<[T]>).
 */
export const FAKE_RX_METHOD = Symbol('FAKE_RX_METHOD');
export type FakeRxMethod<T> = RxMethod<T> & { [FAKE_RX_METHOD]: SinonSpy<[T]> };

/**
 * Creates a new rxMethod mock.
 * The returned function accepts a static value, signal, or observable as an input argument.
 *
 * The Sinon fake stores the call information, when:
 * - the generated function was called with a static value.
 * - the generated function was called with a signal argument, and the signal's value changes.
 * - the generated function was called with an observable argument, and the observable emits.
 *
 * @returns {FakeRxMethod<T>} A new rxMethod mock.
 */
export function newFakeRxMethod<T>(): FakeRxMethod<T> {
  const f = fake<[T]>();
  const r = rxMethod(tap((x) => f(x))) as FakeRxMethod<T>;
  r[FAKE_RX_METHOD] = f;
  return r;
}

/**
 * Converts the type of a (mocked) RxMethod into a FakeRxMethod.
 *
 * @template T - The argument type of the RxMethod.
 * @param {RxMethod<T>} rxMethod - The (mocked) RxMethod to be converted.
 * @returns {FakeRxMethod<T>} The converted FakeRxMethod.
 */
export function asFakeRxMethod<T>(rxMethod: RxMethod<T>): FakeRxMethod<T> {
  return rxMethod as unknown as FakeRxMethod<T>;
}

/**
 * Gets the Sinon fake from a mocked RxMethod.
 *
 * @template T - The argument type of the RxMethod.
 * @param {RxMethod<T>} rxMethod - The (mocked) RxMethod for which to retrieve the Sinon fake.
 * @returns {sinon.SinonSpy<[T], unknown>} The Sinon fake capturing calls to the RxMethod.
 */
export function getRxMethodFake<T>(
  rxMethod: RxMethod<T>
): SinonSpy<[T], unknown> {
  return asFakeRxMethod(rxMethod)[FAKE_RX_METHOD];
}
