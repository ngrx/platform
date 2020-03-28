import { mapTo, mergeMap } from 'rxjs/operators';
import { concat, of, timer } from 'rxjs';
import { coalesce, CoalesceConfig } from '../../../src';
import { marbles } from 'rxjs-marbles/jest';

/** @test {coalesce} */
describe('coalesce operator', () => {
  let cfg: CoalesceConfig = { leading: true, trailing: false };

  it(
    'should simply mirror the source if values are not emitted often enough',
    marbles(m => {
      const e1 = m.hot('^a--------b-----c----|');
      const e1subs = '^--------------------!';
      const e2 = m.cold('----|                 ');
      const e2subs = [
        '-^---!                ',
        '----------^---!       ',
        '----------------^---! ',
      ];
      const expected = '-a--------b-----c----|';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should coalesce with duration Observable using next to close the duration',
    marbles(m => {
      const e1 = m.hot('^a-xy-----b--x--cxxx-|');
      const e1subs = '^--------------------!';
      const e2 = m.cold('----x-y-z            ');
      const e2subs = [
        '-^---!                ',
        '----------^---!       ',
        '----------------^---! ',
      ];
      const expected = '-a--------b-----c----|';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should interrupt source and duration when result is unsubscribed early',
    marbles(m => {
      const e1 = m.hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
      const unsub = '--------------!               ';
      const e1subs = '^-------------!               ';
      const e2 = m.cold(' ---------------------|       ');
      const e2subs = '-^------------!               ';
      const expected = '-a-------------               ';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result, unsub).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should not break unsubscription chains when result is unsubscribed explicitly',
    marbles(m => {
      const e1 = m.hot('-a-x-y-z-xyz-x-y-z----b--x-x-|');
      const e1subs = '^-------------!               ';
      const e2 = m.cold('------------------|           ');
      const e2subs = '-^------------!               ';
      const expected = '-a-------------               ';
      const unsub = '--------------!               ';

      const result = e1.pipe(
        mergeMap((x: string) => of(x)),
        coalesce(() => e2, cfg),
        mergeMap((x: string) => of(x))
      );

      m.expect(result, unsub).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should handle a busy producer emitting a regular repeating sequence',
    marbles(m => {
      const e1 = m.hot('abcdefabcdefabcdefabcdefa|');
      const e1subs = '^------------------------!';
      const e2 = m.cold('-----|                    ');
      const e2subs = [
        '^----!                    ',
        '------^----!              ',
        '------------^----!        ',
        '------------------^----!  ',
        '------------------------^!',
      ];
      const expected = 'a-----a-----a-----a-----a|';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should mirror source if durations are always empty',
    marbles(m => {
      const e1 = m.hot('abcdefabcdefabcdefabcdefa|');
      const e1subs = '^------------------------!';
      const e2 = m.cold('|                         ');
      const expected = 'abcdefabcdefabcdefabcdefa|';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
    })
  );

  it(
    'should take only the first value emitted if duration is a never',
    marbles(m => {
      const e1 = m.hot('----abcdefabcdefabcdefabcdefa|');
      const e1subs = '^----------------------------!';
      const e2 = m.cold('-                             ');
      const e2subs = '----^------------------------!';
      const expected = '----a------------------------|';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should unsubscribe duration Observable when source raise error',
    marbles(m => {
      const e1 = m.hot('----abcdefabcdefabcdefabcdefa#');
      const e1subs = '^----------------------------!';
      const e2 = m.cold('-                             ');
      const e2subs = '----^------------------------!';
      const expected = '----a------------------------#';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should raise error as soon as just-throw duration is used',
    marbles(m => {
      const e1 = m.hot('----abcdefabcdefabcdefabcdefa|');
      const e1subs = '^---!-------------------------';
      const e2 = m.cold('#                             ');
      const e2subs = '----(^!)                      ';
      const expected = '----(a#)                      ';

      const result = e1.pipe(coalesce(() => e2, cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      m.expect(e2).toHaveSubscriptions(e2subs);
    })
  );

  it(
    'should coalesce using durations of constying lengths',
    marbles(m => {
      const e1 = m.hot('abcdefabcdabcdefghabca|   ');
      const e1subs = '^---------------------!   ';
      const e2 = [
        m.cold('-----|                    '),
        m.cold('      ---|                '),
        m.cold('          -------|        '),
        m.cold('                  --|     '),
        m.cold('                     ----|'),
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

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      for (let j = 0; j < e2.length; j++) {
        m.expect(e2[j]).toHaveSubscriptions(e2subs[j]);
      }
    })
  );

  it(
    'should propagate error from duration Observable',
    marbles(m => {
      const e1 = m.hot('abcdefabcdabcdefghabca|   ');
      const e1subs = '^----------------!        ';
      const e2 = [
        m.cold('-----|                    '),
        m.cold('      ---|                '),
        m.cold('          -------#        '),
      ];
      const e2subs = [
        '^----!                    ',
        '------^--!                ',
        '----------^------!        ',
      ];
      const expected = 'a-----a---a------#        ';

      let i = 0;
      const result = e1.pipe(coalesce(() => e2[i++], cfg));

      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(e1subs);
      for (let j = 0; j < e2.length; j++) {
        m.expect(e2[j]).toHaveSubscriptions(e2subs[j]);
      }
    })
  );

  it(
    'should propagate error thrown from durationSelector function',
    marbles(m => {
      const s1 = m.hot('--^--x--x--x--x--x--x--e--x--x--x--|');
      const s1Subs = '^--------------------!              ';
      const n1 = m.cold('----|                               ');
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
      m.expect(result).toBeObservable(exp, undefined, new Error('lol'));
      m.expect(s1).toHaveSubscriptions(s1Subs);
      m.expect(n1).toHaveSubscriptions(n1Subs);
    })
  );

  it(
    'should complete when source does not emit',
    marbles(m => {
      const e1 = m.hot('-----|');
      const subs = '^----!';
      const expected = '-----|';

      function durationSelector() {
        return m.cold('-----|');
      }

      m.expect(e1.pipe(coalesce(durationSelector, cfg))).toBeObservable(
        expected
      );
      m.expect(e1).toHaveSubscriptions(subs);
    })
  );

  it(
    'should raise error when source does not emit and raises error',
    marbles(m => {
      const e1 = m.hot('-----#');
      const subs = '^----!';
      const expected = '-----#';

      function durationSelector() {
        return m.cold('-----|');
      }

      m.expect(e1.pipe(coalesce(durationSelector, cfg))).toBeObservable(
        expected
      );
      m.expect(e1).toHaveSubscriptions(subs);
    })
  );

  it(
    'should handle an empty source',
    marbles(m => {
      const e1 = m.cold('|     ');
      const subs = '(^!)  ';
      const expected = '|     ';

      function durationSelector() {
        return m.cold('-----|');
      }

      m.expect(e1.pipe(coalesce(durationSelector, cfg))).toBeObservable(
        expected
      );
      m.expect(e1).toHaveSubscriptions(subs);
    })
  );

  it(
    'should handle a never source',
    marbles(m => {
      const e1 = m.cold('-     ');
      const subs = '^     ';
      const expected = '-     ';

      function durationSelector() {
        return m.cold('-----|');
      }

      const result = e1.pipe(coalesce(durationSelector, cfg));
      m.expect(result).toBeObservable(expected);
      m.expect(e1).toHaveSubscriptions(subs);
    })
  );

  it(
    'should handle a throw source',
    marbles(m => {
      const e1 = m.cold('#     ');
      const subs = '(^!)  ';
      const expected = '#     ';

      function durationSelector() {
        return m.cold('-----|');
      }

      m.expect(e1.pipe(coalesce(durationSelector, cfg))).toBeObservable(
        expected
      );
      m.expect(e1).toHaveSubscriptions(subs);
    })
  );

  it('should coalesce by promise resolves', () => {
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
    it(
      'should work for individual values',
      marbles(m => {
        const s1 = m.hot('-^-x------------------|     ');
        const s1Subs = ' ^--------------------!     ';
        const n1 = m.cold('   ------------------------|');
        const n1Subs = ['--^------------------!      '];
        const exp = '--x------------------|      ';

        const result = s1.pipe(
          coalesce(() => n1, { leading: true, trailing: true })
        );
        m.expect(result).toBeObservable(exp);
        m.expect(s1).toHaveSubscriptions(s1Subs);
        m.expect(n1).toHaveSubscriptions(n1Subs);
      })
    );
  });

  describe('coalesce(fn, { leading: false, trailing: true })', () => {
    it(
      'should work for individual values',
      marbles(m => {
        const s1 = m.hot('-^-x------------------|     ');
        const s1Subs = ' ^--------------------!     ';
        const n1 = m.cold('   -------------|           ');
        const n1Subs = [' --^------------!           '];
        const exp = ' ---------------x-----|     ';

        const result = s1.pipe(coalesce(() => n1));
        m.expect(result).toBeObservable(exp);
        m.expect(s1).toHaveSubscriptions(s1Subs);
        m.expect(n1).toHaveSubscriptions(n1Subs);
      })
    );
  });
});
