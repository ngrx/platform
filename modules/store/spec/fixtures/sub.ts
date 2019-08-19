export const SUB_PROPERTY = 'SUB_PROPERTY';

export function subReducer(state = {}, { type, payload }: any) {
  switch (type) {
    case SUB_PROPERTY:
      const newState = state ? { ...state } : { property: undefined };
      newState.property = payload;
      return newState;
    default:
      return state;
  }
}
