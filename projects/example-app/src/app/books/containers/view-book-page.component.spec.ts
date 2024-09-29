import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ViewBookPageComponent } from '@example-app/books/containers';
import { ViewBookPageActions } from '@example-app/books/actions/view-book-page.actions';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({
  selector: 'bc-selected-book-page',
  template: '',
  standalone: true,
})
class MockSelectedBookPageComponent {}

describe('View Book Page', () => {
  const setup = () => {
    const store = {
      dispatch: jest.fn(),
      selectSignal: jest.fn(),
    };
    TestBed.overrideComponent(ViewBookPageComponent, {
      set: { imports: [MockSelectedBookPageComponent] },
    });
    TestBed.configureTestingModule({
      imports: [ViewBookPageComponent],
      providers: [{ provide: Store, useValue: store }],
    });

    const fixture = TestBed.createComponent(ViewBookPageComponent);

    const dispatchSpy = store.dispatch;
    const selectSpy = store.selectSignal;

    return { store, fixture };
  };

  it('should compile', () => {
    const { fixture } = setup();
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book. Select action on init', () => {
    const { fixture, store } = setup();

    const action = ViewBookPageActions.selectBook({ id: '2' });
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
