import { AddCommasPipe } from './add-commas.pipe';

describe('Pipe: Add Commas', () => {
  let pipe: AddCommasPipe;

  beforeEach(() => {
    pipe = new AddCommasPipe();
  });

  it('should transform ["Rick"] to "Rick"', () => {
    expect(pipe.transform(['Rick'])).toEqual('Rick');
  });

  it('should transform ["Jeremy", "Andrew"] to "Jeremy and Andrew"', () => {
    expect(pipe.transform(['Jeremy', 'Andrew'])).toEqual('Jeremy and Andrew');
  });

  it('should transform ["Kim", "Ryan", "Amanda"] to "Kim, Ryan, and Amanda"', () => {
    expect(pipe.transform(['Kim', 'Ryan', 'Amanda'])).toEqual(
      'Kim, Ryan, and Amanda'
    );
  });

  it('transforms undefined to "Author Unknown"', () => {
    expect(pipe.transform(undefined)).toEqual('Author Unknown');
  });

  it('transforms [] to "Author Unknown"', () => {
    expect(pipe.transform([])).toEqual('Author Unknown');
  });
});
