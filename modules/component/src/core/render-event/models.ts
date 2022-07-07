interface BaseRenderEvent {
  reset: boolean;
}

export interface SuspenseRenderEvent extends BaseRenderEvent {
  type: 'suspense';
  reset: true;
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
