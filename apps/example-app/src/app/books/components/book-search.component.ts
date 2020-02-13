import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'bc-book-search',
  template: `
    <mat-card>
      <mat-card-title>Find a Book</mat-card-title>
      <mat-card-content>
        <mat-form-field>
          <input matInput placeholder="Search for a book" [value]="query" (keyup)="search.emit($event.target.value)">
        </mat-form-field>
        <mat-spinner [class.show]="searching" [diameter]="30" [strokeWidth]="3"></mat-spinner>
      </mat-card-content>
      <mat-card-footer><span *ngIf="error">{{error}}</span></mat-card-footer>
    </mat-card>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }

      mat-card-footer {
        color: #ff0000;
        padding: 5px 0;
      }

      .mat-form-field {
        min-width: 300px;
        margin-right: 10px; // Make room for the spinner
      }

      .mat-spinner {
        position: relative;
        top: 10px;
        left: 10px;
        visibility: hidden;
      }

      .mat-spinner.show {
        visibility: visible;
      }
    `,
  ],
})
export class BookSearchComponent {
  @Input() query = '';
  @Input() searching = false;
  @Input() error = '';
  @Output() search = new EventEmitter<string>();
}
