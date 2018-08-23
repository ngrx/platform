import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { LogoutConfirmationDialogComponent } from './logout-confirmation-dialog.component';

describe('Logout Confirmation Dialog', () => {
  let fixture: ComponentFixture<LogoutConfirmationDialogComponent>;
  let instance: LogoutConfirmationDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
      declarations: [LogoutConfirmationDialogComponent],
    });

    fixture = TestBed.createComponent(LogoutConfirmationDialogComponent);
    instance = fixture.componentInstance;
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should have buttons that are applied [mat-dialog-close]', () => {
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector(
      '[mat-dialog-close=""]'
    );
    const okButton = fixture.nativeElement.querySelector(
      '[mat-dialog-close="OK"]'
    );
    const buttonCount = fixture.nativeElement.querySelectorAll(
      '[mat-dialog-close]'
    ).length;

    expect(cancelButton).toBeTruthy();
    expect(okButton).toBeTruthy();
    expect(buttonCount).toBe(2);
  });
});
