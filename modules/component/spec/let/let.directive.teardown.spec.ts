import {
  ApplicationRef,
  Component,
  createComponent,
  createEnvironmentInjector,
  EnvironmentInjector,
  ErrorHandler,
  inject,
  Injectable,
  OnDestroy,
  provideZonelessChangeDetection,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { config, Subject } from 'rxjs';
import { LetDirective } from '../..';

type SourceEvent = 'complete' | 'error' | 'next';

@Injectable()
class Source implements OnDestroy {
  readonly value$ = new Subject<string>();
  readonly error = new Error('source error');
  event: SourceEvent = 'complete';

  emit(): void {
    switch (this.event) {
      case 'complete':
        this.value$.complete();
        break;
      case 'error':
        this.value$.error(this.error);
        break;
      case 'next':
        this.value$.next('value');
        break;
    }
  }

  ngOnDestroy(): void {
    this.emit();
  }
}

@Injectable()
class ChildDep {}

@Component({ selector: 'teardown-child', template: 'child' })
class ChildComponent {
  readonly dep = inject(ChildDep);
}

@Component({
  imports: [LetDirective, ChildComponent],
  template: `<ng-container *ngrxLet="value$"><teardown-child /></ng-container>`,
})
class HostComponent {
  readonly value$ = inject(Source).value$;
}

describe('LetDirective environment injector teardown', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  for (const event of ['complete', 'error', 'next'] as const) {
    it.each(['root', 'route'] as const)(
      `should not create a view on ${event} during %s injector destruction`,
      async (scope) => {
        const unhandled: unknown[] = [];
        const previousHandler = config.onUnhandledError;
        const errorHandler = { handleError: vi.fn() };
        const root = createEnvironmentInjector(
          [
            ApplicationRef,
            Source,
            ChildDep,
            { provide: ErrorHandler, useValue: errorHandler },
          ],
          TestBed.inject(EnvironmentInjector)
        );
        const route = createEnvironmentInjector(
          scope === 'route' ? [Source] : [],
          root
        );
        // Initialize the source before ApplicationRef so it emits while the view is subscribed.
        const source = route.get(Source);
        const ref = createComponent(HostComponent, {
          environmentInjector: route,
        });

        try {
          config.onUnhandledError = (error) => unhandled.push(error);
          source.event = event;
          ref.changeDetectorRef.detectChanges();
          expect(ref.location.nativeElement.textContent).toBe('');
          expect(source.value$.observed).toBe(true);

          const injector = scope === 'root' ? root : route;
          injector.destroy();
          expect(route.destroyed).toBe(scope === 'route');
          expect(root.destroyed).toBe(scope === 'root');
          await new Promise((resolve) => setTimeout(resolve));

          expect(unhandled).toEqual([]);
          expect(
            ref.location.nativeElement.querySelector('teardown-child')
          ).toBeNull();
          if (event === 'error') {
            expect(errorHandler.handleError).toHaveBeenCalledWith(source.error);
          }
        } finally {
          ref.destroy();
          if (!route.destroyed) {
            route.destroy();
          }
          if (!root.destroyed) {
            root.destroy();
          }
          config.onUnhandledError = previousHandler;
        }
      }
    );

    it(`should create a view on ${event} before injector destruction`, () => {
      const injector = createEnvironmentInjector(
        [
          Source,
          ChildDep,
          { provide: ErrorHandler, useValue: { handleError: vi.fn() } },
        ],
        TestBed.inject(EnvironmentInjector)
      );
      const ref = createComponent(HostComponent, {
        environmentInjector: injector,
      });

      try {
        const source = injector.get(Source);
        source.event = event;
        ref.changeDetectorRef.detectChanges();
        expect(ref.location.nativeElement.textContent).toBe('');

        source.emit();
        ref.changeDetectorRef.detectChanges();

        expect(ref.location.nativeElement.textContent).toBe('child');
      } finally {
        ref.destroy();
        injector.destroy();
      }
    });
  }
});
