import { Component, Input, ElementRef, signal, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ngrx-code-example',
  standalone: true,
  imports: [MatIcon],
  template: `
    @if (header) {
    <div class="header">{{ header }}</div>
    }

    <div class="body">
      <button
        class="copy-button"
        [class.copied]="copied()"
        (click)="copyCode()"
        (animationend)="onAnimationEnd($event)"
        [title]="copied() ? 'Copied!' : 'Copy code'"
        [attr.aria-label]="
          copied() ? 'Code copied to clipboard' : 'Copy code to clipboard'
        "
      >
        @if(copied()) {
        <mat-icon>done</mat-icon>} @else {
        <mat-icon>content_copy</mat-icon>
        }
      </button>
      <div #codeBody>
        <ng-content></ng-content>
      </div>
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
        position: relative;
      }

      .copy-button {
        position: absolute;
        top: 8px;
        right: 8px;
        cursor: pointer;
        padding: 3px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .copy-button.copied {
        animation: copyFeedback 2s ease-in-out;
      }

      @keyframes copyFeedback {
        0% {
          background: rgba(207, 143, 197, 0.8);
          border-color: rgba(207, 143, 197, 0.6);
          color: rgba(255, 255, 255, 1);
          transform: scale(1);
        }
        15% {
          background: rgba(207, 143, 197, 0.8);
          border-color: rgba(207, 143, 197, 0.6);
          color: rgba(255, 255, 255, 1);
          transform: scale(1.1);
        }
        30% {
          background: rgba(207, 143, 197, 0.8);
          border-color: rgba(207, 143, 197, 0.6);
          color: rgba(255, 255, 255, 1);
          transform: scale(1);
        }
        80% {
          background: rgba(207, 143, 197, 0.8);
          border-color: rgba(207, 143, 197, 0.6);
          color: rgba(255, 255, 255, 1);
          transform: scale(1);
        }
        100% {
          background: rgba(0, 0, 0, 0.7);
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
          transform: scale(1);
        }
      }

      .copy-button:hover {
        border-color: rgba(255, 255, 255, 0.4);
        color: rgba(255, 255, 255, 1);
      }

      .copy-button:active {
        transform: scale(0.95);
      }
    `,
  ],
})
export class CodeExampleComponent {
  @Input() header: string = '';
  codeBody = viewChild.required<ElementRef>('codeBody');
  copied = signal(false);

  copyCode() {
    if (navigator.clipboard && window.isSecureContext) {
      const codeText = this.codeBody().nativeElement.textContent?.trim() || '';
      navigator.clipboard.writeText(codeText);
      this.copied.set(true);
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    this.copied.set(false);
  }
}
