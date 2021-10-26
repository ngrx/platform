# ESLint plugin for NgRx

## What is it?

Lots of projects in Angular use [ESLint](https://eslint.org/) for linting purposes to maintain code quality and general rules. ESLint allows to install [plugins](https://eslint.org/docs/user-guide/configuring/plugins#plugins) for additional rules for the benefit of the codebase. There are lots of third-party plugins for ESLint, and one also exists for NgRx, which helps maintain most common best practices easily. A plugin called [eslint-plugin-ngrx](https://github.com/timdeschryver/eslint-plugin-ngrx) can be installed, configured and used to help maintain those rules.

The plugin comes with a number of rules that help address most popular NgRx malpractices. The rules are configurable so that every developer can choose which ones they necessarily want to follow, and which ones should givbe a linting error or warning, and so on. A detailed documentation of all the rules with examples can be found [here](https://github.com/timdeschryver/eslint-plugin-ngrx/tree/main/docs/rules). Some rules also allow automatic fixes with `ng lint --fix`.

## Installation

You can add the plugin automaticaly with 

```sh
ng add eslint-plugin-ngrx
```

This will add all the configurations and set them to recommended (most rules will throw errors, some minor ones only warning, the command will also prompt you to choose levels of importance).

You can also do a manual installation. If you don't have a TypeScript parser for ESLint, install it with the following command:

```sh
npm install @typescript-eslint/parser --save-dev
```

Then, add the plugin itself:

```sh
npm install eslint-plugin-ngrx --save-dev
```

Then, add it to your ESLint configuration file (for example, `.eslintrc.json`):

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2019,
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "plugins": ["ngrx"],
  "rules": {
    "ngrx/select-style": "error"
  }
}
```

To enable the recommended configuration, add it to your ESLint configuration file.

```json
{
  "extends": ["plugin:ngrx/recommended"]
}
```

Then you can run 

```sh
ng lint
```

And see the problems that the linter will find.

## Configuration

There are several levels of configuration that can be implemented with this plugin:

| Name        | Description                                                                                                                       |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------|
| [recommended](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/recommended.ts) | Only most critical rules (no cyclic effects, no effects in providers and no decorators) give errors, everything else gives warnings  |
| [store](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/store.ts)       | Only rules for the Store, no rules for Effects. Only gives warnings, no errors                                                    |
| [effects](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/effects.ts)     | Only rules for Effects, no rules for Store. Critical rules give errors as in the "recommended" setting, others only give errors   |
| [all](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/all.ts)         | All rules are enabled, only critical ones give errors                                                                             |
| [strict](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/strict.ts)      | All rules are enabled and give errors                                                                                              |











