import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { MyCounterComponent } from '../my-counter/my-counter.component';
import { counterReducer } from '../counter.reducer';

describe('MyCounterComponent', () => {
  let component: MyCounterComponent;
  let fixture: ComponentFixture<MyCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyCounterComponent],
      imports: [StoreModule.forRoot({ count: counterReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCounterComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should increment the counter value when increment is clicked', () => {
    clickByCSS('#increment');

    expect(getCounterText()).toBe('Current Count: 1');
  });

  it('should decrement the counter value when decrement is clicked', () => {
    clickByCSS('#decrement');

    expect(getCounterText()).toBe('Current Count: -1');
  });

  it('should reset the counter value when reset is clicked', () => {
    clickByCSS('#increment');
    clickByCSS('#reset');

    expect(getCounterText()).toBe('Current Count: 0');
  });

  function clickByCSS(selector: string) {
    const debugElement = fixture.debugElement.query(By.css(selector));
    const el: HTMLElement = debugElement.nativeElement;
    el.click();
    fixture.detectChanges();
  }

  function getCounterText() {
    const compiled = fixture.debugElement.nativeElement;
    return compiled.querySelector('div').textContent;
  }
});
