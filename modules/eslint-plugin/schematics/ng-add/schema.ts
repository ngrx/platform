// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Schema {
  config:
    | 'recommended'
    | 'strict'
    | 'store'
    | 'effects'
    | 'component-store'
    | 'all';
}
