import { Component, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CodeHighlightPipe } from './code-highlight.pipe';
import { ExamplesService } from '@ngrx-io/app/examples/examples.service';

@Component({
  selector: 'ngrx-code-example',
  standalone: true,
  imports: [CodeHighlightPipe],
  template: `
    <div class="header">{{ header }}</div>
    <div class="body">
      @if(path) {
      <div [innerHTML]="codeContent() | ngrxCodeHighlight"></div>
      }@else{
      <ng-content />
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(255, 255, 255, 0.12);
        margin: 14px 0 24px;
      }

      .header {
        padding: 8px 16px;
        background-color: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        font-size: 12px;
        font-weight: 500;
      }

      .body {
        padding: 0 0px;
        overflow-x: wrap;
      }
    `,
  ],
})
export class CodeExampleComponent {
  @Input() header: string = '';
  @Input() path: string = '';
  @Input() region: string = '';
  @Input() language: string = 'typescript';

  private exampleService = inject(ExamplesService);
  private platformId = inject(PLATFORM_ID);
  protected codeContent = signal('');

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    if (!this.path) return;

    const content = await this.exampleService.extractSnippet(
      this.path,
      this.region
    );
    this.codeContent.set(content);
  }
}
