import { Component } from '@angular/core';

/**
 * Dialog will close with 'OK' result if user clicks ok button.
 */
export type LogoutConfirmationDialogResult = 'OK' | undefined;

@Component({
  template: `
    <h2 mat-dialog-title>Logout</h2>
    <mat-dialog-content>Do you really want to logout?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button mat-dialog-close="OK">OK</button>
    </mat-dialog-actions>
  `,
})
export class LogoutConfirmationDialogComponent {}
