import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { LogoutConfirmationDialogComponent } from '@example-app/auth/components';

describe('Logout Confirmation Dialog', () => {
  let fixture: ComponentFixture<LogoutConfirmationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
      declarations: [LogoutConfirmationDialogComponent],
    });

    fixture = TestBed.createComponent(LogoutConfirmationDialogComponent);
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
