interface BaseRenderEvent {
  reset: boolean;
}

export interface ResetRenderEvent extends BaseRenderEvent {
  type: 'reset';
  reset: true;
}

export interface NextRenderEvent<T> extends BaseRenderEvent {
  type: 'next';
  value: T | null | undefined;
}

export interface ErrorRenderEvent extends BaseRenderEvent {
  type: 'error';
  error: unknown;
}

export interface CompleteRenderEvent extends BaseRenderEvent {
  type: 'complete';
}

export type RenderEvent<T> =
  | ResetRenderEvent
  | NextRenderEvent<T>
  | ErrorRenderEvent
  | CompleteRenderEvent;
