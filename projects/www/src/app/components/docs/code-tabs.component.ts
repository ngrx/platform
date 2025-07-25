import {
  Component,
  OnInit,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CodeExampleComponent } from './code-example.component';

@Component({
  selector: 'ngrx-code-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CodeExampleComponent],
  template: `
    <div #content style="display: none"><ng-content></ng-content></div>

    <mat-tab-group [preserveContent]="true">
      @for (tab of tabs(); track tab) {
      <mat-tab [label]="tab.header">
        <ngrx-code-example [innerHTML]="tab.code"> </ngrx-code-example>
      </mat-tab>
      }
    </mat-tab-group>
  `,
  styles: [
    `
      ngrx-code-example {
        margin: 0;
      }
    `,
  ],
})
export class CodeTabsComponent implements OnInit {
  private domSanitizer = inject(DomSanitizer);
  private content = viewChild.required<ElementRef>('content');
  protected tabs = signal<TabInfo[]>([]);

  ngOnInit() {
    const codeExamples =
      this.content().nativeElement.querySelectorAll('ngrx-code-example') ?? [];
    const examples: TabInfo[] = [...codeExamples].map((example) =>
      this.extractTabInfo(example)
    );
    this.tabs.set(examples);
  }

  private extractTabInfo(tabContent: HTMLElement): TabInfo {
    return {
      code: this.domSanitizer.bypassSecurityTrustHtml(
        tabContent.querySelector('pre')?.parentElement?.innerHTML ?? ''
      ),
      header: tabContent.getAttribute('header') || '',
    };
  }
}

export interface TabInfo {
  code: SafeHtml;
  header: string;
}
