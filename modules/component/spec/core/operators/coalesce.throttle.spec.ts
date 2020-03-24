import { TestScheduler } from 'rxjs/internal/testing/TestScheduler';
import { observableMatcher } from '../../observableMatcher';
import { mergeMap, mapTo } from 'rxjs/operators';
import { of, concat, timer } from 'rxjs';
import { coalesce, CoalesceConfig } from '../../../src';

/** @test {coalesce} */
describe('coalesce operator', () => {
  let testScheduler: TestScheduler;
  let cfg: CoalesceConfig = { leading: true, trailing: false };

  beforeEach(() => {
    testScheduler = new TestScheduler(observableMatcher);
  });

  it('should simply mirror the source if values are not emitted often enough', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('^a--------b-----c----|');
        const e1subs = '^--------------------!';
        const e2 = cold('----|                 ');
        const e2subs = [
          '-^---!                ',
          '----------^---!       ',
          '----------------^---! ',
        ];
        const expected = '-a--------b-----c----|';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should coalesce with duration Observable using next to close the duration', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('^a-xy-----b--x--cxxx-|');
        const e1subs = '^--------------------!';
        const e2 = cold('----x-y-z            ');
        const e2subs = [
          '-^---!                ',
          '----------^---!       ',
          '----------------^---! ',
        ];
        const expected = '-a--------b-----c----|';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should interrupt source and duration when result is unsubscribed early', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
        const unsub = '--------------!               ';
        const e1subs = '^-------------!               ';
        const e2 = cold(' ---------------------|       ');
        const e2subs = '-^------------!               ';
        const expected = '-a-------------               ';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should not break unsubscription chains when result is unsubscribed explicitly', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
        const e1subs = '^-------------!               ';
        const e2 = cold('------------------|           ');
        const e2subs = '-^------------!               ';
        const expected = '-a-------------               ';
        const unsub = '--------------!               ';

        const result = e1.pipe(
          mergeMap((x: string) => of(x)),
          coalesce(() => e2, cfg),
          mergeMap((x: string) => of(x))
        );

        expectObservable(result, unsub).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should handle a busy producer emitting a regular repeating sequence', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('abcdefabcdefabcdefabcdefa|');
        const e1subs = '^------------------------!';
        const e2 = cold('-----|                    ');
        const e2subs = [
          '^----!                    ',
          '------^----!              ',
          '------------^----!        ',
          '------------------^----!  ',
          '------------------------^!',
        ];
        const expected = 'a-----a-----a-----a-----a|';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should mirror source if durations are always empty', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('abcdefabcdefabcdefabcdefa|');
        const e1subs = '^------------------------!';
        const e2 = cold('|                         ');
        const expected = 'abcdefabcdefabcdefabcdefa|';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
      }
    );
  });

  it('should take only the first value emitted if duration is a never', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('----abcdefabcdefabcdefabcdefa|');
        const e1subs = '^----------------------------!';
        const e2 = cold('-                             ');
        const e2subs = '----^------------------------!';
        const expected = '----a------------------------|';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should unsubscribe duration Observable when source raise error', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('----abcdefabcdefabcdefabcdefa#');
        const e1subs = '^----------------------------!';
        const e2 = cold('-                             ');
        const e2subs = '----^------------------------!';
        const expected = '----a------------------------#';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should raise error as soon as just-throw duration is used', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('----abcdefabcdefabcdefabcdefa|');
        const e1subs = '^---!-------------------------';
        const e2 = cold('#                             ');
        const e2subs = '----(^!)                      ';
        const expected = '----(a#)                      ';

        const result = e1.pipe(coalesce(() => e2, cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        expectSubscriptions(e2.subscriptions).toBe(e2subs);
      }
    );
  });

  it('should coalesce using durations of constying lengths', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('abcdefabcdabcdefghabca|   ');
        const e1subs = '^---------------------!   ';
        const e2 = [
          cold('-----|                    '),
          cold('      ---|                '),
          cold('          -------|        '),
          cold('                  --|     '),
          cold('                     ----|'),
        ];
        const e2subs = [
          '^----!                    ',
          '------^--!                ',
          '----------^------!        ',
          '------------------^-!     ',
          '---------------------^!   ',
        ];
        const expected = 'a-----a---a-------a--a|   ';

        let i = 0;
        const result = e1.pipe(coalesce(() => e2[i++], cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (let j = 0; j < e2.length; j++) {
          expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
        }
      }
    );
  });

  it('should propagate error from duration Observable', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('abcdefabcdabcdefghabca|   ');
        const e1subs = '^----------------!        ';
        const e2 = [
          cold('-----|                    '),
          cold('      ---|                '),
          cold('          -------#        '),
        ];
        const e2subs = [
          '^----!                    ',
          '------^--!                ',
          '----------^------!        ',
        ];
        const expected = 'a-----a---a------#        ';

        let i = 0;
        const result = e1.pipe(coalesce(() => e2[i++], cfg));

        expectObservable(result).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(e1subs);
        for (let j = 0; j < e2.length; j++) {
          expectSubscriptions(e2[j].subscriptions).toBe(e2subs[j]);
        }
      }
    );
  });

  it('should propagate error thrown from durationSelector function', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const s1 = hot('--^--x--x--x--x--x--x--e--x--x--x--|');
        const s1Subs = '^--------------------!              ';
        const n1 = cold('----|                               ');
        const n1Subs = [
          '---^---!                            ',
          '---------^---!                      ',
          '---------------^---!                ',
        ];
        const exp = '---x-----x-----x-----(e#)           ';

        let i = 0;
        const result = s1.pipe(
          coalesce(() => {
            if (i++ === 3) {
              throw new Error('lol');
            }
            return n1;
          }, cfg)
        );
        expectObservable(result).toBe(exp, undefined, new Error('lol'));
        expectSubscriptions(s1.subscriptions).toBe(s1Subs);
        expectSubscriptions(n1.subscriptions).toBe(n1Subs);
      }
    );
  });

  it('should complete when source does not emit', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('-----|');
        const subs = '^----!';
        const expected = '-----|';

        function durationSelector() {
          return cold('-----|');
        }

        expectObservable(e1.pipe(coalesce(durationSelector, cfg))).toBe(
          expected
        );
        expectSubscriptions(e1.subscriptions).toBe(subs);
      }
    );
  });

  it('should raise error when source does not emit and raises error', () => {
    testScheduler.run(
      ({ cold, hot, expectObservable, expectSubscriptions }) => {
        const e1 = hot('-----#');
        const subs = '^----!';
        const expected = '-----#';

        function durationSelector() {
          return cold('-----|');
        }

        expectObservable(e1.pipe(coalesce(durationSelector, cfg))).toBe(
          expected
        );
        expectSubscriptions(e1.subscriptions).toBe(subs);
      }
    );
  });

  it('should handle an empty source', () => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const e1 = cold('|     ');
      const subs = '(^!)  ';
      const expected = '|     ';
      function durationSelector() {
        return cold('-----|');
      }

      expectObservable(e1.pipe(coalesce(durationSelector, cfg))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });

  it('should handle a never source', () => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const e1 = cold('-     ');
      const subs = '^     ';
      const expected = '-     ';
      function durationSelector() {
        return cold('-----|');
      }

      expectObservable(e1.pipe(coalesce(durationSelector, cfg))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });

  it('should handle a throw source', () => {
    testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const e1 = cold('#     ');
      const subs = '(^!)  ';
      const expected = '#     ';
      function durationSelector() {
        return cold('-----|');
      }

      expectObservable(e1.pipe(coalesce(durationSelector, cfg))).toBe(expected);
      expectSubscriptions(e1.subscriptions).toBe(subs);
    });
  });

  it('should coalesce by promise resolves', () => {
    testScheduler.run(() => {
      const e1 = concat(
        of(1),
        timer(10).pipe(mapTo(2)),
        timer(10).pipe(mapTo(3)),
        timer(50).pipe(mapTo(4))
      );
      const expected = [1, 2, 3, 4];

      e1.pipe(
        coalesce(() => {
          return new Promise((resolve: any) => {
            resolve(42);
          });
        }, cfg)
      ).subscribe(
        (x: number) => {
          expect(x).to.equal(expected.shift());
        },
        () => {
          throw new Error('should not be called');
        },
        () => {
          expect(expected.length).to.equal(0);
        }
      );
    });
  });

  it('should raise error when promise rejects', () => {
    const e1 = concat(
      of(1),
      timer(10).pipe(mapTo(2)),
      timer(10).pipe(mapTo(3)),
      timer(50).pipe(mapTo(4))
    );
    const expected = [1, 2, 3];
    const error = new Error('error');

    e1.pipe(
      coalesce((x: number) => {
        if (x === 3) {
          return new Promise((resolve: any, reject: any) => {
            reject(error);
          });
        } else {
          return new Promise((resolve: any) => {
            resolve(42);
          });
        }
      })
    ).subscribe(
      (x: number) => {
        expect(x).to.equal(expected.shift());
      },
      (err: any) => {
        expect(err).to.be.an('error', 'error');
        expect(expected.length).to.equal(0);
      },
      () => {
        throw new Error('should not be called');
      }
    );
  });

  describe('coalesce(fn, { leading: true, trailing: true })', () => {
    it('should work for individual values', () => {
      testScheduler.run(
        ({ cold, hot, expectObservable, expectSubscriptions }) => {
          const s1 = hot('-^-x------------------|     ');
          const s1Subs = ' ^--------------------!     ';
          const n1 = cold('   ------------------------|');
          const n1Subs = ['--^------------------!      '];
          const exp = '--x------------------|      ';

          const result = s1.pipe(
            coalesce(() => n1, { leading: true, trailing: true })
          );
          expectObservable(result).toBe(exp);
          expectSubscriptions(s1.subscriptions).toBe(s1Subs);
          expectSubscriptions(n1.subscriptions).toBe(n1Subs);
        }
      );
    });
  });

  describe('coalesce(fn, { leading: false, trailing: true })', () => {
    it('should work for individual values', () => {
      testScheduler.run(
        ({ cold, hot, expectObservable, expectSubscriptions }) => {
          const s1 = hot('-^-x------------------|     ');
          const s1Subs = ' ^--------------------!     ';
          const n1 = cold('   -------------|           ');
          const n1Subs = [' --^------------!           '];
          const exp = ' ---------------x-----|     ';

          const result = s1.pipe(coalesce(() => n1));
          expectObservable(result).toBe(exp);
          expectSubscriptions(s1.subscriptions).toBe(s1Subs);
          expectSubscriptions(n1.subscriptions).toBe(n1Subs);
        }
      );
    });
  });
});
