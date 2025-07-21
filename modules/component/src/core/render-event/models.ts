interface BaseRenderEvent {
  /**
   * true if the event is emitted by a new source
   */
  reset: boolean;
  /**
   * true if the synchronous event is emitted
   */
  synchronous: boolean;
}

/**
 * A render event indicating a suspense state (loading/pending).
 *
 * @public
 */
export interface SuspenseRenderEvent extends BaseRenderEvent {
  type: 'suspense';
  reset: true;
  synchronous: true;
}

/**
 * A render event containing the next value from the source.
 *
 * @public
 */
export interface NextRenderEvent<T> extends BaseRenderEvent {
  type: 'next';
  value: T;
}

/**
 * A render event indicating an error occurred.
 *
 * @public
 */
export interface ErrorRenderEvent extends BaseRenderEvent {
  type: 'error';
  error: unknown;
}

/**
 * A render event indicating the source has completed.
 *
 * @public
 */
export interface CompleteRenderEvent extends BaseRenderEvent {
  type: 'complete';
}

/**
 * Union type of all possible render events.
 *
 * @public
 */
export type RenderEvent<T> =
  | SuspenseRenderEvent
  | NextRenderEvent<T>
  | ErrorRenderEvent
  | CompleteRenderEvent;
