import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from '@example-app/auth/containers';
import { LoginFormComponent } from '@example-app/auth/components';
import * as fromAuth from '@example-app/auth/reducers';
import { LoginPageActions } from '@example-app/auth/actions';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MaterialModule } from '@example-app/material';

describe('Login Page', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let store: MockStore;
  let instance: LoginPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MaterialModule, ReactiveFormsModule],
      declarations: [LoginPageComponent, LoginFormComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: fromAuth.selectLoginPagePending, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(LoginPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
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
