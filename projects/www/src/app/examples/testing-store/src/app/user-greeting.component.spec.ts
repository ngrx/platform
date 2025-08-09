import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserGreetingComponent } from './user-greeting.component';
import * as fromAuth from './reducers';

describe('User Greeting Component', () => {
  let fixture: ComponentFixture<UserGreetingComponent>;
  let mockStore: MockStore;
  let mockUsernameSelector: MemoizedSelector<fromAuth.State, string>;
  const queryDivText = () =>
    fixture.debugElement.queryAll(By.css('div'))[0].nativeElement.textContent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      declarations: [UserGreetingComponent],
    });

    fixture = TestBed.createComponent(UserGreetingComponent);
    mockStore = TestBed.inject(MockStore);
    mockUsernameSelector = mockStore.overrideSelector(
      fromAuth.getUsername,
      'John'
    );
    fixture.detectChanges();
  });

  it('should greet John when the username is John', () => {
    expect(queryDivText()).toBe('Greetings, John!');
  });

  it('should greet Brandon when the username is Brandon', () => {
    mockUsernameSelector.setResult('Brandon');
    mockStore.refreshState();
    fixture.detectChanges();
    expect(queryDivText()).toBe('Greetings, Brandon!');
  });
});
