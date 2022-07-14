import { combineRenderEventHandlers } from '../../../src/core/render-event/handlers';
import {
  CompleteRenderEvent,
  ErrorRenderEvent,
  NextRenderEvent,
  RenderEvent,
  SuspenseRenderEvent,
} from '../../../src/core/render-event/models';

describe('combineRenderEventHandlers', () => {
  function testRenderEvent<T>(event: RenderEvent<T>): void {
    describe(`when ${event.type} is emitted`, () => {
      it(`should call ${event.type} handler`, () => {
        const mockHandler = jest.fn();
        const handleRenderEvent = combineRenderEventHandlers({
          [event.type]: mockHandler,
        });

        handleRenderEvent(event);
        expect(mockHandler).toHaveBeenCalledWith(event);
      });

      it(`should not throw error if ${event.type} handler is not defined`, () => {
        const handleRenderEvent = combineRenderEventHandlers({});
        expect(() => handleRenderEvent(event)).not.toThrowError();
      });
    });
  }

  const suspenseEvent: SuspenseRenderEvent = {
    type: 'suspense',
    reset: true,
    synchronous: true,
  };
  testRenderEvent(suspenseEvent);

  const nextEvent: NextRenderEvent<number> = {
    type: 'next',
    value: 1,
    reset: true,
    synchronous: false,
  };
  testRenderEvent(nextEvent);

  const errorEvent: ErrorRenderEvent = {
    type: 'error',
    error: 'ERROR!',
    reset: false,
    synchronous: true,
  };
  testRenderEvent(errorEvent);

  const completeEvent: CompleteRenderEvent = {
    type: 'complete',
    reset: false,
    synchronous: false,
  };
  testRenderEvent(completeEvent);
});
