import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatInputModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { LoginPageComponent } from '@example-app/auth/containers/login-page.component';
import { LoginFormComponent } from '@example-app/auth/components/login-form.component';
import * as fromAuth from '@example-app/auth/reducers';
import { LoginPageActions } from '@example-app/auth/actions';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('Login Page', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let store: MockStore<fromAuth.State>;
  let instance: LoginPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginPageComponent, LoginFormComponent],
      providers: [provideMockStore()],
    });

    fixture = TestBed.createComponent(LoginPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    store.overrideSelector(fromAuth.getLoginPagePending, false);

    spyOn(store, 'dispatch');
  });

  /**
   * Container components are used as integration points for connecting
   * the store to presentational components and dispatching
   * actions to the store.
   *
   * Container methods that dispatch events are like a component's output observables.
   * Container properties that select state from store are like a component's input properties.
   * If pure components are functions of their inputs, containers are functions of state
   *
   * Traditionally you would query the components rendered template
   * to validate its state. Since the components are analogous to
   * pure functions, we take snapshots of these components for a given state
   * to validate the rendered output and verify the component's output
   * against changes in state.
   */
  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a login event on submit', () => {
    const credentials: any = {};
    const action = LoginPageActions.login({ credentials });

    instance.onSubmit(credentials);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
