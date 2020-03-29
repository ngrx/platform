import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { mergeMapTo, share } from 'rxjs/operators';
import { concat, defer, from, of, timer } from 'rxjs';
import { jestMatcher } from '../../helper/jest.observable-matcher';

import { generateFrames, coalesce, CoalesceConfig } from '../../../src/core';

/** @test {coalesce} */
describe('coalesce operator additional logic', () => {
  let testScheduler: TestScheduler;
  let coalesceConfig: CoalesceConfig;

  beforeEach(() => {
    testScheduler = new TestScheduler(jestMatcher);
  });

  it('should emit last value if source completes before durationSelector', () => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const s1 = cold('---abcdef---|');
      const s1Subs = '^-----------!';
      const n1 = cold('   ----------');
      const n1Subs = ['---^--------!'];
      const exp = '------------(f|)';

      const result = s1.pipe(coalesce(() => n1));
      expectObservable(result).toBe(exp);
      expectSubscriptions(s1.subscriptions).toBe(s1Subs);
      expectSubscriptions(n1.subscriptions).toBe(n1Subs);
    });
  });

  describe('with config { leading: true, trailing: false })', () => {
    // Tests in file coalesce.throttle.spec.ts
  });

  describe('with default config { leading: false, trailing: true }', () => {
    it('should emit last for async values when durationSelector is EMPTY', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('---abcdef---|');
        const s1Subs = '^-----------!';
        const n1 = cold('   -----|    ');
        const n1Subs = ['---^----!    '];
        const exp = '--------f---|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit last delayed for sync values when durationSelector is longer', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('--(abcdef)--|');
        const s1Subs = '^-----------!';
        const n1 = cold('  --------|  ');
        const n1Subs = ['--^-------!  '];
        const exp = '----------f-|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit last for sync values when durationSelector is EMPTY', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('(abcdef)|');
        const s1Subs = '^-------!';
        const n1 = cold('|        ');
        const n1Subs = ['(^!)     '];
        const exp = '(f)-----|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit last for sync values when durationSelector is generateFrames', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const durationSelector = () => generateFrames();
        const s1 = cold('(abcdef)|');
        const exp = '--------(f|)';

        const result = s1.pipe(coalesce(durationSelector, coalesceConfig));
        expectObservable(result).toBe(exp);
      });
    });

    it('should emit last for multiple sync values when durationSelector is generateFrames', () => {
      const durationSelector = () => generateFrames();
      const e1 = concat(
        of(1, 2, 3),
        timer(10).pipe(mergeMapTo(of(4, 5, 6))),
        timer(10).pipe(mergeMapTo(of(7, 8, 9))),
        timer(50).pipe(mergeMapTo(of(10, 11, 12)))
      );
      const expected = [3, 6, 9, 12];
      e1.pipe(coalesce(durationSelector)).subscribe(
        (x: number) => {
          expect(x).toEqual(expected.shift());
        },
        () => {
          throw new Error('should not be called');
        },
        () => {
          expect(expected.length).toEqual(0);
        }
      );
    });
  });

  describe('with config { leading: true, trailing: true })', () => {
    beforeEach(() => {
      coalesceConfig = {
        leading: true,
        trailing: true,
      };
    });

    it('should have the right config', () => {
      expect(coalesceConfig.leading).toBe(true);
      expect(coalesceConfig.trailing).toBe(true);
    });

    it('should use right durationSelectors', () => {
      let sync: any;
      let microRes: any;
      let syncRes: any;
      const s1 = of(1);
      const s2 = generateFrames();
      expect(microRes).toBe(undefined);
      expect(sync).toBe(undefined);
      sync = 'test';
      s1.subscribe(n => (syncRes = n));
      s2.subscribe(n => (microRes = n));
      expect(sync).toBe('test');
      expect(syncRes).toBe(1);
      expect(microRes).toBe(undefined);
      setTimeout(() => {
        expect(microRes).not.toBe(undefined);
      });
    });

    it('should emit first and last for async values when durationSelector is EMPTY', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('---abcdef---|');
        const s1Subs = '^-----------!';
        const n1 = cold('   -----|    ');
        const n1Subs = ['---^----!    '];
        const exp = '---a----f---|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit first and last delayed for sync values when durationSelector is longer', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('--(abcdef)--|');
        const s1Subs = '^-----------!';
        const n1 = cold('  --------|  ');
        const n1Subs = ['--^-------!  '];
        const exp = '--a-------f-|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit first and last for sync values when durationSelector is EMPTY', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('(abcdef)|');
        const s1Subs = '^-------!';
        const n1 = cold('|        ');
        const n1Subs = ['(^!)     '];
        const exp = '(af)----|';

        const result = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result).toBe(exp);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit first and last for sync values when durationSelector is generateFrames', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const durationSelector = () => generateFrames();
        const s1 = cold('(abcdef)|');
        const exp = 'a-------(f|)';

        const result = s1.pipe(coalesce(durationSelector, coalesceConfig));
        expectObservable(result).toBe(exp);
      });
    });

    it('should emit first and last for multiple sync values when durationSelector is generateFrames', () => {
      const durationSelector = () => generateFrames();
      const e1 = concat(
        of(1, 2, 3),
        timer(10).pipe(mergeMapTo(of(4, 5, 6))),
        timer(10).pipe(mergeMapTo(of(7, 8, 9))),
        timer(50).pipe(mergeMapTo(of(10, 11, 12)))
      );
      const expected = [1, 3, 4, 6, 7, 9, 10, 12];
      e1.pipe(coalesce(durationSelector)).subscribe(
        (x: number) => {
          expect(x).toEqual(expected.shift());
        },
        () => {
          throw new Error('should not be called');
        },
        () => {
          expect(expected.length).toEqual(0);
        }
      );
    });
  });

  describe('with scoping', () => {
    it('should emit per subscriber by default async', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('---abcdef---|');
        const s1Subs = ['^-----------!', '^-----------!'];
        const n1 = cold('   -----|    ');
        const n1Subs = ['---^----!    ', '---^----!    '];
        const exp1 = '--------f---|';
        const exp2 = '--------f---|';

        const result1 = s1.pipe(coalesce(() => n1));
        const result2 = s1.pipe(coalesce(() => n1));
        expectObservable(result1).toBe(exp1);
        expectObservable(result2).toBe(exp2);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit per subscriber by default sync', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const s1 = cold('--(abcdef)--|');
        const s1Subs = ['^-----------!', '^-----------!'];
        const n1 = cold('  (-----|)   ');
        const n1Subs = ['--(^----!)   ', '--(^----!)   '];
        const exp1 = '--(-----f)--|';
        const exp2 = '--(-----f)--|';

        const result1 = s1.pipe(coalesce(() => n1));
        const result2 = s1.pipe(coalesce(() => n1));
        expectObservable(result1).toBe(exp1);
        expectObservable(result2).toBe(exp2);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      });
    });

    it('should emit only once per scope async', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const coalesceConfig = {
          leading: false,
          trailing: true,
          context: window as any,
        };

        const s1 = cold('---abcdef---|');
        const s1Subs = ['^-----------!', '^-----------!'];
        const n1 = cold('   -----|    ');

        const exp1 = '--------f---|';
        const exp2 = '------------|';

        const result1 = s1.pipe(coalesce(() => n1, coalesceConfig));
        const result2 = s1.pipe(coalesce(() => n1, coalesceConfig));
        expectObservable(result1).toBe(exp1);
        expectObservable(result2).toBe(exp2);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
      });
    });

    it('should emit only once per scope sync', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
        const coalesceConfig = {
          leading: false,
          trailing: true,
          context: window as any,
        };

        const s1 = cold('---(abcdef)---|');
        const s1Subs = ['^-------------!', '^-------------!'];
        const d1 = cold('   --------|   ');

        const exp1 = '-----------f--|';
        const exp2 = '--------------|';
        const result1 = s1.pipe(coalesce(() => d1, coalesceConfig));
        const result2 = s1.pipe(coalesce(() => d1, coalesceConfig));
        expectObservable(result1).toBe(exp1);
        expectObservable(result2).toBe(exp2);
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
      });
    });

    describe('with different durationSelector', () => {
      it('should emit once per micro task (THEORY)', () => {
        let syncEmission1: any;
        emit(undefined, 'promise1');
        expect(syncEmission1).not.toBeDefined();
        emit('promise1', 'promise2');
        expect(syncEmission1).not.toBeDefined();
        setTimeout(() => {
          expect(syncEmission1).toBe('promise2');
        });

        //

        function emit(prev: any, next: any): any {
          Promise.resolve().then(() => {
            expect(syncEmission1).toBe(prev);
            syncEmission1 = next;
          });
        }
      });

      it('should emit once per micro task', () => {
        testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
          const coalesceConfig = {
            leading: false,
            trailing: true,
            context: window as any,
          };
          testScheduler.run(() => {
            let syncEmission1: any;
            let syncEmission2: any;

            const arrNum = [1, 2, 3, 4];
            const arrAlph = ['a', 'b', 'c', 'd'];
            const num$ = from(arrNum).pipe(
              share(),
              coalesce(() => defer(() => from([1])), coalesceConfig)
            );
            const alph$ = from(arrAlph).pipe(
              share(),
              coalesce(() => defer(() => from([1])), coalesceConfig)
            );

            expect(syncEmission1).not.toBeDefined();
            num$.subscribe(
              (x: number) => {
                syncEmission1 = x;
                // if(syncEmission1 !== 4) {
                throw new Error('should be called one');
                // }
              },
              () => {
                throw new Error('should not be called');
              },
              () => {
                expect(syncEmission1).not.toBeDefined();
              }
            );

            alph$.subscribe(
              (x: string) => {
                syncEmission1 = x;
                if (syncEmission1 !== 'd') {
                  throw new Error('should not be called');
                }
              },
              () => {
                throw new Error('should not be called');
              },
              () => {
                expect(syncEmission1).toBe('d');
              }
            );
          });
        });
      });

      // different durationSelectors (NOT RECOMMENDED!)
      it('should emit after the first durationSelectors completion if sync (THIS IS BAD)', () => {
        testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
          const coalesceConfig = {
            leading: false,
            trailing: true,
            context: window as any,
          };

          const s1 = cold('---(abcdef)-|');
          const s1Subs = ['^-----------!', '^-----------!'];
          const d1 = cold('   ---|      ');
          const d2 = cold('   -----|    ');
          const exp1 = '------f-----|';
          const exp2 = '------------|';

          const result1 = s1.pipe(coalesce(() => d1, coalesceConfig));
          const result2 = s1.pipe(coalesce(() => d2, coalesceConfig));
          expectObservable(result1).toBe(exp1);
          expectObservable(result2).toBe(exp2);
          expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        });
      });

      it('should interfere with other durationSelectors if async (THIS IS BAD)', () => {
        testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
          const coalesceConfig = {
            leading: false,
            trailing: true,
            context: window as any,
          };

          const s1 = cold('----abcdef--|');
          const s1Subs = ['^-----------!', '^-----------!'];
          const d1 = cold('    ---|     ');
          const d1Subs = ['----^--!     ', '--------^--! '];
          const d2 = cold('    -----|   ');
          const d2Subs = ['----^----!   '];
          const exp1 = '-------d----|';
          const exp2 = '---------f--|';

          const result1 = s1.pipe(coalesce(() => d1, coalesceConfig));
          const result2 = s1.pipe(coalesce(() => d2, coalesceConfig));
          expectObservable(result1).toBe(exp1);
          expectObservable(result2).toBe(exp2);
          expectSubscriptions(s1.subscriptions).toBe(s1Subs);
          expectSubscriptions(d1.subscriptions).toBe(d1Subs);
          expectSubscriptions(d2.subscriptions).toBe(d2Subs);
        });
      });
    });
  });
});
