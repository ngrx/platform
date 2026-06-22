export interface Schema {
  config:
    | 'all'
    | 'allTypeChecked'
    | 'componentStore'
    | 'effects'
    | 'effectsTypeChecked'
    | 'operators'
    | 'signals'
    | 'signalsTypeChecked'
    | 'store';
}
