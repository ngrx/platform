<ngrx-docs-alert type="help">

**<a href="/guide/signals"><b>NgRx Signals</b></a> is the new default.**

The NgRx team recommends using the `@ngrx/signals` library for local state management in Angular.
While ComponentStore remains supported, we encourage using `@ngrx/signals` for new projects and considering migration for existing ones.

</ngrx-docs-alert>

# Installation

## Installing with `ng add`

You can install the ComponentStore to your project with the following `ng add` command <a href="https://angular.dev/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/component-store@latest
```

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/component-store`.
2. Run the package manager to install the added dependency.

## Manual Installation

You can also install `@ngrx/component-store` manually using one of the following commands:

<ngrx-docs-install package-name="@ngrx/component-store"></ngrx-docs-install>
