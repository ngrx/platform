interface State {
  id: string;
  text: string;
  completed: boolean;
}

const todo = (state: State | undefined, action: any) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.payload.id,
        text: action.payload.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (state?.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        completed: !state?.completed,
      });

    default:
      return state;
  }
};

export const todos = (state = [], action: any) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, todo(undefined, action)];
    case 'TOGGLE_TODO':
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

export const todoCount = (state = 0, action: any) => {
  switch (action.type) {
    case 'SET_COUNT':
      return action.payload;
    default:
      return state;
  }
};
