import {
  CompleteRenderEvent,
  ErrorRenderEvent,
  NextRenderEvent,
  RenderEvent,
  SuspenseRenderEvent,
} from './models';

/**
 * Interface defining handlers for different types of render events.
 *
 * @public
 */
export interface RenderEventHandlers<T> {
  suspense?(event: SuspenseRenderEvent): void;
  next?(event: NextRenderEvent<T>): void;
  error?(event: ErrorRenderEvent): void;
  complete?(event: CompleteRenderEvent): void;
}

/**
 * Combines render event handlers into a single function that can handle any render event.
 *
 * @param handlers - The render event handlers to combine.
 * @returns A function that handles render events.
 *
 * @public
 */
export function combineRenderEventHandlers<T>(
  handlers: RenderEventHandlers<T>
): (event: RenderEvent<T>) => void {
  return (event) => handlers[event.type]?.(event as any);
}
