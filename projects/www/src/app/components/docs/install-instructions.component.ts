import { Component, computed, input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeExampleComponent } from './code-example.component';

@Component({
  selector: 'ngrx-install-instructions',
  standalone: true,
  imports: [MatTabsModule, CodeExampleComponent],
  template: `
    <mat-tab-group [preserveContent]="true">
      <mat-tab label="npm">
        <p>
          For more information on using <code>npm</code> check out the docs
          <a
            href="https://docs.npmjs.com/cli/install"
            target="_blank"
            rel="noopener noreferrer"
            >here</a
          >.
        </p>
        <ngrx-code-example [snippet]="npmCommand()" language="sh" />
      </mat-tab>
      <mat-tab label="pnpm">
        <p>
          For more information on using <code>pnpm</code> check out the docs
          <a
            href="https://pnpm.io/cli/add"
            target="_blank"
            rel="noopener noreferrer"
            >here</a
          >.
        </p>
        <ngrx-code-example [snippet]="pnpmCommand()" language="sh" />
      </mat-tab>
      <mat-tab label="yarn">
        <p>
          For more information on using <code>yarn</code> check out the docs
          <a
            href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies"
            target="_blank"
            rel="noopener noreferrer"
            >here</a
          >.
        </p>
        <ngrx-code-example [snippet]="yarnCommand()" language="sh" />
      </mat-tab>
    </mat-tab-group>
  `,
})
export class InstallInstructionsComponent {
  packageName = input('');
  devDependency = input(false);

  npmCommand = computed(
    () =>
      `npm install ${this.packageName()}${this.devDependency() ? ' --save-dev' : ''}`
  );

  pnpmCommand = computed(
    () =>
      `pnpm add ${this.packageName()}${this.devDependency() ? ' --save-dev' : ''}`
  );

  yarnCommand = computed(
    () =>
      `yarn add ${this.packageName()}${this.devDependency() ? ' --dev' : ''}`
  );
}
