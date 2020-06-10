export interface TodoItem {
  id: number;
  completed: boolean;
  text: string;
}

export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export const COMPLETE_ALL_TODOS = 'COMPLETE_ALL_TODOS';

let _id = 0;

export function resetId() {
  _id = 0;
}

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

export function visibilityFilter(
  state = VisibilityFilters.SHOW_ALL,
  { type, payload }: any
) {
  switch (type) {
    case SET_VISIBILITY_FILTER:
      return payload;
    default:
      return state;
  }
}

export function todos(
  state: TodoItem[] = [],
  { type, payload }: any
): TodoItem[] {
  switch (type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: ++_id,
          text: payload.text,
          completed: false,
        },
      ];
    case COMPLETE_ALL_TODOS:
      return state.map((todo) => ({ ...todo, completed: true }));
    case COMPLETE_TODO:
      return state.map((todo) =>
        todo.id === payload.id ? { ...todo, completed: true } : todo
      );
    default:
      return state;
  }
}
