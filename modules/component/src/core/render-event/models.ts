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

export interface SuspenseRenderEvent extends BaseRenderEvent {
  type: 'suspense';
  reset: true;
  synchronous: true;
}

export interface NextRenderEvent<T> extends BaseRenderEvent {
  type: 'next';
  value: T;
}

export interface ErrorRenderEvent extends BaseRenderEvent {
  type: 'error';
  error: unknown;
}

export interface CompleteRenderEvent extends BaseRenderEvent {
  type: 'complete';
}

export type RenderEvent<T> =
  | SuspenseRenderEvent
  | NextRenderEvent<T>
  | ErrorRenderEvent
  | CompleteRenderEvent;
