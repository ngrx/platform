export type Selector<T, V> = (state: T) => V;

export type SelectorWithProps<State, Props, Result> = (
  state: State,
  props: Props
) => Result;
