import { ActionsUnion, createAction } from '@ngrx/store';

describe('createAction with properties', () => {
  describe('action type: const', () => {
    it('type only', () => {
      const ACTION1 = '[action] Action1 blah';
      const actualAction = createAction(ACTION1);
      type expectedActionType = Readonly<{
        type: '[action] Action1 blah';
      }>;

      const expectedAction: expectedActionType = {
        type: ACTION1,
      };
      expect(actualAction).toEqual(expectedAction);
    });

    it('type and properties', () => {
      const properties = { userName: 'UserName', age: 32 };
      const ACTION1 = '[action] Action1 blah';
      const actualAction = createAction(ACTION1, properties);
      type expectedActionType = Readonly<{
        type: '[action] Action1 blah';
        userName: string;
        age: number;
      }>;

      const expectedAction: expectedActionType = {
        type: ACTION1,
        userName: properties.userName,
        age: properties.age,
      };
      expect(actualAction).toEqual(expectedAction);
    });
  });

  describe('action type: enum', () => {
    it('type only', () => {
      enum ActionTypes {
        Action1 = '[action] Action1 blah',
        Action2 = '[action] Action2 blah',
      }

      const actualAction = createAction(ActionTypes.Action1);
      type expectedActionType = Readonly<{
        type: ActionTypes.Action1;
      }>;

      const expectedAction: expectedActionType = {
        type: ActionTypes.Action1,
      };
      expect(actualAction).toEqual(expectedAction);
    });

    it('type and properties', () => {
      const properties = { userName: 'UserName', age: 32 };
      enum ActionTypes {
        Action1 = '[action] Action1 blah',
        Action2 = '[action] Action2 blah',
      }

      const actualAction = createAction(ActionTypes.Action1, properties);
      type expectedActionType = Readonly<{
        type: ActionTypes.Action1;
        userName: string;
        age: number;
      }>;

      const expectedAction: expectedActionType = {
        type: ActionTypes.Action1,
        userName: properties.userName,
        age: properties.age,
      };
      expect(actualAction).toEqual(expectedAction);
    });
  });
});

describe('ActionsUnion type', () => {
  enum ActionTypes {
    Login = '[Login Page] Login',
    Logout = '[Login Page] Logout',
  }

  const Actions = {
    login: (userName: string, password: string) =>
      createAction(ActionTypes.Login, { userName, password }),
    logout: () => createAction(ActionTypes.Logout),
  };

  type Actions = ActionsUnion<typeof Actions>;

  it('Action with properties', () => {
    const properties = { userName: 'UserName', password: 'Password' };
    const actualAction = Actions.login(
      properties.userName,
      properties.password
    );
    type expectedActionType = Readonly<{
      type: ActionTypes.Login;
      userName: string;
      password: string;
    }>;
    const expectedAction: expectedActionType = {
      type: ActionTypes.Login,
      userName: properties.userName,
      password: properties.password,
    };
    expect(actualAction).toEqual(expectedAction);
  });

  it('Action without properties', () => {
    const actualAction = Actions.logout();
    type expectedActionType = Readonly<{
      type: ActionTypes.Logout;
    }>;
    const expectedAction: expectedActionType = {
      type: ActionTypes.Logout,
    };
    expect(actualAction).toEqual(expectedAction);
  });
});
