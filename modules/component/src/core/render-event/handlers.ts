import {
  CompleteRenderEvent,
  ErrorRenderEvent,
  NextRenderEvent,
  RenderEvent,
  ResetRenderEvent,
} from './models';

export interface RenderEventHandlers<T> {
  reset?(event: ResetRenderEvent): void;
  next?(event: NextRenderEvent<T>): void;
  error?(event: ErrorRenderEvent): void;
  complete?(event: CompleteRenderEvent): void;
}

export function combineRenderEventHandlers<T>(
  handlers: RenderEventHandlers<T>
): (event: RenderEvent<T>) => void {
  return (event) => handlers[event.type]?.(event as any);
}
