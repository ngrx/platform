import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs/operators';

// #docregion state
export interface SlideToggleState {
  checked: boolean;
}
// #enddocregion state

/** Change event object emitted by a SlideToggleComponent. */
export interface MatSlideToggleChange {
  /** The source MatSlideToggle of the event. */
  readonly source: SlideToggleComponent;
  /** The new `checked` value of the MatSlideToggle. */
  readonly checked: boolean;
}

// #docregion providers
@Component({
  selector: 'mat-slide-toggle',
  templateUrl: 'slide-toggle.html',
  // #enddocregion providers
  styleUrls: ['./slide-toggle.scss'],
  encapsulation: ViewEncapsulation.None,
  // #docregion providers
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class SlideToggleComponent {
  // #enddocregion providers
  // #docregion updater
  @Input() set checked(value: boolean) {
    this.setChecked(value);
  }
  // #enddocregion updater
  // #docregion selector
  // Observable<MatSlideToggleChange> used instead of EventEmitter
  @Output() readonly change = this.componentStore.select((state) => ({
    source: this,
    checked: state.checked,
  }));
  // #enddocregion selector

  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;

  // #docregion updater
  readonly setChecked = this.componentStore.updater(
    (state, value: boolean) => ({ ...state, checked: value })
  );
  // #enddocregion updater

  // #docregion selector
  // ViewModel for the component
  readonly vm$ = this.componentStore.select((state) => ({
    checked: state.checked,
  }));
  // #enddocregion selector

  // #docregion providers, init
  constructor(
    private readonly componentStore: ComponentStore<SlideToggleState>
  ) {
    // #enddocregion providers
    // set defaults
    this.componentStore.setState({
      checked: false,
    });
  }
  // #enddocregion init

  // #docregion updater
  onChangeEvent = this.componentStore.effect<Event>((event$) => {
    return event$.pipe(
      tap<Event>((event) => {
        event.stopPropagation();
        this.setChecked(this.inputElement.nativeElement.checked);
      })
    );
  });
  // #enddocregion updater
  // #docregion providers
}
// #enddocregion providers
