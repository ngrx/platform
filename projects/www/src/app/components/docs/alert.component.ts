import { Component, computed, input } from '@angular/core';

export type AlertType = 'inform' | 'warn' | 'error' | 'help';

@Component({
  selector: 'ngrx-alert',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  host: {
    '[class.inform]': 'isInform()',
    '[class.warn]': 'isWarn()',
    '[class.error]': 'isError()',
    '[class.help]': 'isHelp()',
  },
  styles: [
    `
      :host {
        display: block;
        padding: 0px 16px 16px;
        margin: 14px 0;
        border-left: 8px solid;
        border-top: 1px solid;
        border-bottom: 1px solid;
        border-right: 1px solid;
        border-color: var(--ngrx-border-color);
      }

      :host p {
        margin: 0;
      }

      :host(.inform) {
        border-color: rgb(97, 174, 238);
        background-color: rgba(97, 174, 238, 0.12);
      }

      :host(.warn) {
        border-color: rgb(255, 184, 113);
        background-color: rgba(255, 184, 113, 0.12);
      }

      :host(.error) {
        border-color: rgb(220, 53, 69);
        background-color: rgba(220, 53, 69, 0.12);
      }

      :host(.help) {
        border-color: var(--ngrx-link);
        background-color: rgba(255, 172, 230, 0.08);
      }

      :host + h2 {
        margin-top: 0;
      }
    `,
  ],
})
export class AlertComponent {
  type = input<AlertType>('inform');
  #validatedType = computed(() => {
    const type = this.type();
    if (
      type !== 'inform' &&
      type !== 'warn' &&
      type !== 'error' &&
      type !== 'help'
    ) {
      throw new Error(
        `Invalid alert type: ${type}. Must be: 'inform', 'warn', 'error', or 'help'.`
      );
    }

    return type;
  });
  isInform = computed(() => this.#validatedType() === 'inform');
  isWarn = computed(() => this.#validatedType() === 'warn');
  isError = computed(() => this.#validatedType() === 'error');
  isHelp = computed(() => this.#validatedType() === 'help');
}
