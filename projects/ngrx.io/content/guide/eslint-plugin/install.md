# Installation

## Installing with `npm`

For more information on using `npm` check out the docs <a href="https://docs.npmjs.com/cli/install" target="_blank">here</a>.

```sh
npm install @ngrx/eslint-plugin --save
```

## Installing with `yarn`

For more information on using `yarn` check out the docs <a href="https://yarnpkg.com/getting-started/usage#installing-all-the-dependencies" target="_blank">here</a>.

```sh
yarn add @ngrx/eslin-plugin
```

## Installing with `ng add`

If your project is using the Angular CLI 6+ then you can install the plugin to your project with the following `ng add` command <a href="https://angular.io/cli/add" target="_blank">(details here)</a>:

```sh
ng add @ngrx/eslint-plugin
```

The command will prompt you to select which config you would like to have preconfigured:

| Name                                | Description                                                                                                                       |
|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| recommended                         | Only most critical rules (no cyclic effects, no effects in providers and no decorators) give errors, everything else is warnings  |
| recommended-requiring-type-checking | Same as recommended, but with type checking enabled                                                                               |
| store                               | Only rules for the Store, no rules for Effects. Only gives warnings, no errors                                                    |
| store-strict                        | Same as store, but all rules are enabled and give errors                                                                          |
| effects                             | Only rules for Effects, no rules for Store. Critical rules give errors as in the "recommended" setting, others only give errors   |
| effects-requiring-type-checking     | Same as effects, but with type checking enabled                                                                                   |
| effects-strict                      | Same as effects, but all rules are enabled and give errors                                                                        |
| component-store                     | Recommended setup only for component-store                                                                                        |
| component-store-strict              | Same as component-store, but all rules are enabled and give errors                                                                |
| all                                 | All rules are enabled, only critical ones give errors                                                                             |
| all-requiring-type-checking         | Same as all, but with type checking enabled                                                                                       |
| strict                              | All rules are enabled an give errors                                                                                              |
| strict-requiring-type-checking      | Same as strict, but with type checking enabled                                                                                    |

