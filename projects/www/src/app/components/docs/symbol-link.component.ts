import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  Injector,
  Input,
  inject,
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
  template: `@if (isPrivate) {{{ name }}} @else if (shouldUseExternalLink) {<a
      [href]="url"
      target="_blank"
      >{{ name }}</a
    >} @else {<a [routerLink]="url" #internalSymbolLink>{{ name }}</a
    >}`,
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
  url = '';
  isPrivate = true;
  parsedReference: ParsedCanonicalReference = new ParsedCanonicalReference(
    '@ngrx/store!Store:class'
  );
  shouldUseExternalLink = false;

  /**
   * Signal inputs aren't supported by @angular/elements, so we need
   * to use a traditional input to set the reference.
   */
  @Input({ required: true }) set reference(ref: CanonicalReference) {
    const parsed = new ParsedCanonicalReference(ref);
    this.isPrivate = parsed.isPrivate;
    this.shouldUseExternalLink =
      parsed.package.startsWith('@angular') || parsed.package === 'rxjs';
    this.parsedReference = parsed;

    if (parsed.isPrivate) {
      this.url = '';
    } else if (parsed.package.startsWith('@ngrx')) {
      const [_ngrx, ...rest] = parsed.package.split('/');
      this.url = `/api/${rest.join('/')}/${parsed.name}`;
    } else if (parsed.package.startsWith('@angular')) {
      const [, packageName] = parsed.package.split('/');

      this.url = `https://angular.dev/api/${packageName}/${parsed.name}`;
    } else if (parsed.package === 'rxjs') {
      this.url = `https://rxjs.dev/api/index/${parsed.kind}/${parsed.name}`;
    } else {
      throw new Error(`Unknown package: ${parsed.package}`);
    }
  }

  get name() {
    if (this.parsedReference.isPrivate) {
      return this.parsedReference.name.slice(1);
    }

    return this.parsedReference.name;
  }

  constructor() {
    toObservable(this.internalSymbolLink)
      .pipe(
        switchMap((linkRef) => {
          if (!linkRef) return EMPTY;

          const link = linkRef.nativeElement;

          return fromEvent(link, 'mouseenter').pipe(
            switchMap(() =>
              this.referenceService.loadFromCanonicalReference(
                this.parsedReference.referenceString
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
