import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ExamplesService } from '@ngrx-io/app/examples/examples.service';

@Component({
  selector: 'ngrx-docs-stackblitz',
  standalone: true,
  template: `
    @if (isEmbedded()) {
      <div [attr.title]="name()" #example></div>
    } @else {
      <button
        type="button"
        class="stackblitz-link"
        (click)="openStackblitz()"
        [attr.title]="name()"
      >
        <ng-content>StackBlitz example</ng-content>
      </button>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ngrx-docs-stackblitz iframe {
        display: block;
        width: 100%;
        height: 800px;
        border: none;
      }

      ngrx-docs-stackblitz .stackblitz-link {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: var(--ngrx-link);
        cursor: pointer;
      }
    `,
  ],
})
export class StackblitzComponent implements AfterViewInit {
  examplesService = inject(ExamplesService);
  platformId = inject(PLATFORM_ID);
  name = input('__base');
  embedded = input('false');

  exampleRef = viewChild.required<ElementRef<HTMLDivElement>>('example');
  isEmbedded = computed(() => this.embedded() !== 'false');

  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) return;
    if (!this.isEmbedded()) return;

    this.examplesService.load(this.exampleRef().nativeElement, this.name());
  }

  openStackblitz(): void {
    this.examplesService.open(this.name());
  }
}
