import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { ExamplesService } from '@ngrx-io/app/examples/examples.service';

@Component({
  selector: 'ngrx-docs-stackblitz',
  standalone: true,
  template: `
    @if(isEmbedded) {
    <div [attr.title]="name" #example></div>
    } @else {
    <a (click)="openStackblitz()" [attr.title]="name"
      ><ng-content>StackBlitz example</ng-content></a
    >
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
    `,
  ],
})
export class StackblitzComponent implements AfterViewInit {
  examplesService = inject(ExamplesService);
  platformId = inject(PLATFORM_ID);
  @Input() name = '__base';
  @Input() embedded = 'false';

  exampleRef = viewChild.required<ElementRef<HTMLDivElement>>('example');

  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) return;
    if (!this.isEmbedded) return;

    this.examplesService.load(this.exampleRef().nativeElement, this.name);
  }

  openStackblitz(): void {
    this.examplesService.open(this.name);
  }

  get isEmbedded(): boolean {
    return this.embedded !== 'false';
  }
}
