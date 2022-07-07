import {
  CompleteRenderEvent,
  ErrorRenderEvent,
  NextRenderEvent,
  RenderEvent,
  SuspenseRenderEvent,
} from './models';

export interface RenderEventHandlers<T> {
  suspense?(event: SuspenseRenderEvent): void;
  next?(event: NextRenderEvent<T>): void;
  error?(event: ErrorRenderEvent): void;
  complete?(event: CompleteRenderEvent): void;
}

export function combineRenderEventHandlers<T>(
  handlers: RenderEventHandlers<T>
): (event: RenderEvent<T>) => void {
  return (event) => handlers[event.type]?.(event as any);
}
