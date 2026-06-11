# Installation

## Installing with `ng add`

You can install the Router Store to your project with the following `ng add` command <a href="https://angular.dev/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/router-store@latest
```

### Optional `ng add` flags

| flag        | description                                                                                                                                                                                        | value type | default value |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| `--path`    | Path to the module that you wish to add the import for the `StoreRouterConnectingModule` to.                                                                                                       | `string`   |
| `--project` | Name of the project defined in your `angular.json` to help locating the module to add the `StoreRouterConnectingModule` to.                                                                        | `string`   |
| `--module`  | Name of file containing the module that you wish to add the import for the `StoreRouterConnectingModule` to. Can also include the relative path to the file. For example, `src/app/app.module.ts`. | `string`   | `app`         |

This command will automate the following steps:

1. Update `package.json` > `dependencies` with `@ngrx/router-store`.
2. Run `npm install` to install those dependencies.
3. By default it adds `provideRouterStore()` to the `ApplicationConfig` in the `app.config.ts` file. If you provided flags then the command will attempt to locate and update the corresponding config found by the flags.

## Manual Installation

You can also install `@ngrx/router-store` manually using one of the following commands:

<ngrx-docs-install package-name="@ngrx/router-store"></ngrx-docs-install>
