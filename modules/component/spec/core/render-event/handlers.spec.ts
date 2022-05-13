import { combineRenderEventHandlers } from '../../../src/core/render-event/handlers';
import {
  CompleteRenderEvent,
  ErrorRenderEvent,
  NextRenderEvent,
  RenderEvent,
  ResetRenderEvent,
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

  const resetEvent: ResetRenderEvent = {
    type: 'reset',
    reset: true,
  };
  testRenderEvent(resetEvent);

  const nextEvent: NextRenderEvent<number> = {
    type: 'next',
    value: 1,
    reset: true,
  };
  testRenderEvent(nextEvent);

  const errorEvent: ErrorRenderEvent = {
    type: 'error',
    error: 'ERROR!',
    reset: false,
  };
  testRenderEvent(errorEvent);

  const completeEvent: CompleteRenderEvent = {
    type: 'complete',
    reset: false,
  };
  testRenderEvent(completeEvent);
});
