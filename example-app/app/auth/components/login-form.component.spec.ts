import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { LoginFormComponent } from './login-form.component';
import * as Auth from '../actions/auth';
import * as fromAuth from '../reducers';
import { ReactiveFormsModule } from '@angular/forms';

describe('Login Page', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let instance: LoginFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LoginFormComponent);
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
    instance.pending = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display an error message if provided', () => {
    instance.errorMessage = 'Invalid credentials';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit an event if the form is valid when submitted', () => {
    const credentials = {
      username: 'user',
      password: 'pass',
    };
    instance.form.setValue(credentials);

    spyOn(instance.submitted, 'emit');
    instance.submit();

    expect(instance.submitted.emit).toHaveBeenCalledWith(credentials);
  });
});
