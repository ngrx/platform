import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginFormComponent } from '@example-app/auth/components';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('Login Page', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let instance: LoginFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [provideNoopAnimations()],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LoginFormComponent);
    fixture.componentRef.setInput('pending', false);
    instance = fixture.componentInstance;
  });

  it('should compile', () => {
    fixture.detectChanges();

    /**
     * The login form is a presentational component, as it
     * only derives its state from inputs and communicates
     * externally through outputs. We can use snapshot
     * tests to validate the presentation state of this component
     * by changing its inputs and snapshotting the generated
     * HTML.
     *
     * We can also use this as a validation tool against changes
     * to the component's template against the currently stored
     * snapshot.
     */
    expect(fixture).toMatchSnapshot();
  });

  it('should disable the form if pending', () => {
    fixture.componentRef.setInput('pending', true);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display an error message if provided', () => {
    fixture.componentRef.setInput('errorMessage', 'Invalid credentials');

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit an event if the form is valid when submitted', () => {
    const credentials = {
      username: 'user',
      password: 'pass',
    };

    const inpUsername: HTMLInputElement = fixture.debugElement.query(
      By.css('input[data-testid=username]')
    ).nativeElement;
    const inpPassword: HTMLInputElement = fixture.debugElement.query(
      By.css('input[data-testid=password]')
    ).nativeElement;

    fixture.detectChanges();
    inpUsername.value = credentials.username;
    inpUsername.dispatchEvent(new Event('input'));
    inpPassword.value = credentials.password;
    inpPassword.dispatchEvent(new Event('input'));

    jest.spyOn(instance.submitted, 'emit');
    instance.submit();

    expect(instance.submitted.emit).toHaveBeenCalledWith(credentials);
  });
});
