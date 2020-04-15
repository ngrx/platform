import {
  MonoTypeOperatorFunction,
  Observable,
  Operator,
  SubscribableOrPromise,
  Subscriber,
  Subscription,
  TeardownLogic,
} from 'rxjs';
import {
  InnerSubscriber,
  OuterSubscriber,
  subscribeToResult,
} from 'rxjs/internal-compatibility';
import { generateFrames } from '../projections';
import { createPropertiesWeakMap } from '../utils/create_properties-weakmap';

export interface CoalesceConfig {
  context?: object;
  leading?: boolean;
  trailing?: boolean;
}

interface CoalescingContextProps {
  isCoalescing: boolean;
}

const coalescingContextPropertiesMap = createPropertiesWeakMap<
  object,
  CoalescingContextProps
>(ctx => ({
  isCoalescing: false,
}));

const defaultCoalesceConfig: CoalesceConfig = {
  leading: false,
  trailing: true,
  context: undefined,
};

function getCoalesceConfig(
  config: CoalesceConfig = defaultCoalesceConfig
): CoalesceConfig {
  return {
    ...defaultCoalesceConfig,
    ...config,
  };
}

export const defaultCoalesceDurationSelector = <T>(value: T) =>
  generateFrames();

/**
 * @description
 * Limits the number of synchronous emitted a value from the source Observable to
 * one emitted value per [`AnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame),
 * then repeats this process for every tick of the browsers event loop.
 *
 * The coalesce operator is based on the [throttle](https://rxjs-dev.firebaseapp.com/api/operators/throttle) operator.
 * In addition to that is provides emitted values for the trailing end only, as well as maintaining a context to scope coalescing.
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector - A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * It defaults to `requestAnimationFrame` as durationSelector.
 * @param {Object} config - A configuration object to define `leading` and `trailing` behavior and the context object.
 * Defaults to `{ leading: false, trailing: true }`. The default scoping is per subscriber.
 * @return {Observable<T>} An Observable that performs the coalesce operation to
 * limit the rate of emissions from the source.
 *
 * @usageNotes
 * Emit clicks at a rate of at most one click per second
 * ```ts
 * import { fromEvent, animationFrames } from 'rxjs';
 * import { coalesce } from 'ngRx/component';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(coalesce(ev => animationFrames));
 * result.subscribe(x => console.log(x));
 * ```
 */
export function coalesce<T>(
  durationSelector: (
    value: T
  ) => SubscribableOrPromise<any> = defaultCoalesceDurationSelector,
  config?: CoalesceConfig
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.lift(new CoalesceOperator(durationSelector, config));
}

class CoalesceOperator<T> implements Operator<T, T> {
  constructor(
    private durationSelector: (value: T) => SubscribableOrPromise<any>,
    private config?: CoalesceConfig
  ) {}

  call(subscriber: Subscriber<T>, source: any): TeardownLogic {
    return source.subscribe(
      new CoalesceSubscriber(subscriber, this.durationSelector, this.config)
    );
  }
}

class CoalesceSubscriber<T, R> extends OuterSubscriber<T, R> {
  private _coalesced: Subscription | null | undefined;
  private _sendValue: T | null = null;
  private _hasValue = false;
  private _leading: boolean | undefined;
  private _trailing: boolean | undefined;
  private _context: object;
  private _contextProps: CoalescingContextProps;

  constructor(
    protected destination: Subscriber<T>,
    private durationSelector: (value: T) => SubscribableOrPromise<number>,
    config?: CoalesceConfig
  ) {
    super(destination);
    const parsedConfig = getCoalesceConfig(config);
    this._leading = parsedConfig.leading;
    this._trailing = parsedConfig.trailing;
    // We create the object for context scoping by default per subscription
    this._context = parsedConfig.context || {};
    this._contextProps = coalescingContextPropertiesMap.getProps(this._context);
  }

  protected _next(value: T): void {
    this._hasValue = true;
    this._sendValue = value;

    if (!this._coalesced) {
      this.send();
    }
  }

  protected _complete(): void {
    this.coalescingDone();
    super._complete();
  }

  private send() {
    const { _hasValue, _sendValue, _leading } = this;
    if (_hasValue) {
      if (_leading) {
        this.destination.next(_sendValue!);
        this._hasValue = false;
        this._sendValue = null;
      }
      this.startCoalesceDuration(_sendValue!);
    }
  }

  private exhaustLastValue() {
    const { _hasValue, _sendValue } = this;
    if (_hasValue && _sendValue) {
      this.destination.next(_sendValue!);
      this._hasValue = false;
      this._sendValue = null;
    }
  }

  private startCoalesceDuration(value: T): void {
    const duration = this.tryDurationSelector(value);
    if (!!duration) {
      this.add((this._coalesced = subscribeToResult(this, duration)));
      coalescingContextPropertiesMap.setProps(this._context, {
        isCoalescing: true,
      });
    }
  }

  private coalescingDone() {
    const { _coalesced, _trailing, _contextProps } = this;
    if (_coalesced) {
      _coalesced.unsubscribe();
    }
    this._coalesced = null;

    if (_contextProps.isCoalescing) {
      if (_trailing) {
        this.exhaustLastValue();
      }
      coalescingContextPropertiesMap.setProps(this._context, {
        isCoalescing: false,
      });
    }
  }

  private tryDurationSelector(value: T): SubscribableOrPromise<any> | null {
    try {
      return this.durationSelector(value);
    } catch (err) {
      this.destination.error(err);
      return null;
    }
  }

  notifyNext(
    outerValue: T,
    innerValue: R,
    outerIndex: number,
    innerIndex: number,
    innerSub: InnerSubscriber<T, R>
  ): void {
    this.coalescingDone();
  }

  notifyComplete(): void {
    this.coalescingDone();
  }
}
