import { Component } from '@angular/core';

/**
 * The dialog will close with 'OK' result if user clicks ok button,
 * otherwise it will close with undefined.
 */
export enum LogoutConfirmationDialogResults {
  OK = 'OK',
}

export type LogoutConfirmationDialogResultTypes =
  | LogoutConfirmationDialogResults
  | undefined;

@Component({
  template: `
    <h2 mat-dialog-title>Logout</h2>
    <mat-dialog-content>Do you really want to logout?</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="successValue">OK</button>
    </mat-dialog-actions>
  `,
})
export class LogoutConfirmationDialogComponent {
  successValue = LogoutConfirmationDialogResults.OK;
}
