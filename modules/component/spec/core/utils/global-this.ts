(function(Object) {
  typeof globalThis !== 'object' &&
    // @ts-ignore
    (this
      ? get()
      : (Object.defineProperty(Object.prototype, '_T_', {
          configurable: true,
          // @ts-ignore
          get: get,
        }),
        '_T_'));

  function get() {
    // @ts-ignore
    this.globalThis = this;
    // @ts-ignore
    delete Object.prototype['_T_'];
  }
})(Object);

export default globalThis;
