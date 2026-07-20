import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  computed,
  ElementRef,
  Injector,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CanonicalReference, ParsedCanonicalReference } from '@ngrx-io/shared';
import { EMPTY, Observable, fromEvent, switchMap, takeUntil } from 'rxjs';
import {
  SYMBOl_POPOVER_REF,
  SymbolPopoverComponent,
} from './symbol-popover.component';
import { ReferenceService } from '@ngrx-io/app/reference/reference.service';

@Component({
  selector: 'ngrx-symbol-link',
  imports: [RouterLink, SymbolPopoverComponent],
  // Spacing is intentional to avoid unnecessary whitespace in the output
  template: `@if (isPrivate()) {
      {{ name() }}
    } @else if (shouldUseExternalLink()) {
      <a [href]="url()" target="_blank">{{ name() }}</a>
    } @else {
      <a [routerLink]="url()" #internalSymbolLink>{{ name() }}</a>
    }`,
  styles: [
    `
      a {
        color: inherit;
        text-decoration: none;
      }
    `,
  ],
})
export class SymbolLinkComponent {
  injector = inject(Injector);
  overlay = inject(Overlay);
  referenceService = inject(ReferenceService);
  internalSymbolLink =
    viewChild<ElementRef<HTMLAnchorElement>>('internalSymbolLink');
  reference = input<CanonicalReference>('@ngrx/store!Store:class');
  parsedReference = computed(
    () => new ParsedCanonicalReference(this.reference())
  );
  isPrivate = computed(() => this.parsedReference().isPrivate);
  shouldUseExternalLink = computed(() => {
    const parsed = this.parsedReference();

    return parsed.package.startsWith('@angular') || parsed.package === 'rxjs';
  });
  url = computed(() => {
    const parsed = this.parsedReference();

    if (parsed.isPrivate) {
      return '';
    }

    if (parsed.package.startsWith('@ngrx')) {
      const [_ngrx, ...rest] = parsed.package.split('/');
      return `/api/${rest.join('/')}/${parsed.name}`;
    }

    if (parsed.package.startsWith('@angular')) {
      const [, packageName] = parsed.package.split('/');

      return `https://angular.dev/api/${packageName}/${parsed.name}`;
    }

    if (parsed.package === 'rxjs') {
      return `https://rxjs.dev/api/index/${parsed.kind}/${parsed.name}`;
    }

    throw new Error(`Unknown package: ${parsed.package}`);
  });
  name = computed(() => {
    const parsed = this.parsedReference();

    if (parsed.isPrivate) {
      return parsed.name.slice(1);
    }

    return parsed.name;
  });

  constructor() {
    toObservable(this.internalSymbolLink)
      .pipe(
        switchMap((linkRef) => {
          if (!linkRef) return EMPTY;

          const link = linkRef.nativeElement;

          return fromEvent(link, 'mouseenter').pipe(
            switchMap(() =>
              this.referenceService.loadFromCanonicalReference(
                this.parsedReference().referenceString
              )
            ),
            switchMap((apiMemberSummary) => {
              const overlay = this.overlay.create({
                positionStrategy: this.overlay
                  .position()
                  .flexibleConnectedTo(link)
                  .withPositions([
                    {
                      originX: 'center',
                      originY: 'bottom',
                      overlayX: 'center',
                      overlayY: 'top',
                    },
                  ]),
                hasBackdrop: false,
                scrollStrategy: this.overlay.scrollStrategies.close(),
              });
              const injector = Injector.create({
                parent: this.injector,
                providers: [
                  {
                    provide: SYMBOl_POPOVER_REF,
                    useValue: apiMemberSummary,
                  },
                ],
              });
              const componentPortal = new ComponentPortal(
                SymbolPopoverComponent,
                null,
                injector
              );

              return new Observable(() => {
                overlay.attach(componentPortal);

                return () => overlay.detach();
              }).pipe(takeUntil(fromEvent(link, 'mouseleave')));
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        error: console.error,
      });
  }
}
