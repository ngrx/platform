import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  AfterContentInit,
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
export class CodeTabsComponent implements AfterContentInit {
  private domSanitizer = inject(DomSanitizer);
  private content = viewChild.required<ElementRef>('content');
  protected tabs = signal<TabInfo[]>([]);

  async ngAfterContentInit() {
    // Wait a short period for content projection to complete because the content is read asynchronously
    await new Promise((res) => setTimeout(res, 1000));

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
