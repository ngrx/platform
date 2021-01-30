import {
  createActionModifier,
  createActionWithModifiers,
} from '../src/action_with_modifiers_creator';
import { props } from '../src/action_creator';

describe('createActionWithModifiers', () => {
  it('should inject properties onto action', () => {
    // given
    const notificationMessageKey = 'notification-message';
    const requestIdKey = 'request-id';

    const hasNotification = createActionModifier(
      (config: { message: string }) => ({
        [notificationMessageKey]: config.message,
      })
    );

    const isEndOfRequest = createActionModifier(
      (config: { requestState: { id: number } }) => ({
        [requestIdKey]: config.requestState.id,
      })
    );

    const createRequestState = () => ({ id: Math.random() });

    const aFormRequestState = createRequestState();

    const aFormSaveSuccess = createActionWithModifiers(
      'A Form Save Success',
      props<{ form: { name: string } }>(),
      (payload) =>
        hasNotification({
          message: `${payload.form.name} has been saved as the new name`,
        }),
      () => isEndOfRequest({ requestState: aFormRequestState })
    );

    // when
    const result = aFormSaveSuccess({ form: { name: 'David' } });

    // then
    expect(result).toEqual({
      type: 'A Form Save Success',
      form: {
        name: 'David',
      },
      [notificationMessageKey]: 'David has been saved as the new name',
      [requestIdKey]: aFormRequestState.id,
    });
  });
});
