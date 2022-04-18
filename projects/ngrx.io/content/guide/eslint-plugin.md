# ESLint plugin for NgRx

Use [ESLint](https://eslint.org/) to follow the best practices and to avoid common pitfalls in your application.

The [NgRx ESLint Plugin](https://github.com/timdeschryver/eslint-plugin-ngrx) is no different and promotes the key concepts to create a maintainable project. It consists of @ngrx/store, @ngrx/effects, and @ngrx/component-store rules and a handful of preconfigured configurations.

The plugin comes with a number of rules that help address most popular NgRx malpractices. The rules are configurable so that you can choose the ones you want to follow, and which rules should give a linting error or warning.

A detailed documentation of all the rules with examples can be found on the [documentation page](https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/README.md#rules).

Some rules also allow automatic fixes with `ng lint --fix`.

## Installation

### Adding with NgRx

If you use `ng add @ngrx/store` to install NgRx itself, and you already use ESLint, the schematic automatically adds the plugin.

### Installing with `ng add`

If you already have @ngrx/store installed, you can add the plugin manually with the following command:

```sh
ng add eslint-plugin-ngrx
```

This installs the package and configures ESLint to enable the recommended rules.

### Installing with `npm`

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
    "ecmaVersion": 2020,
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
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "project": "./tsconfig.json",
    "sourceType": "module"
  },
  "overrides" [
    {
      "files": ["*.ts"],
      "extends": ["plugin:@ngrx/recommended"]
    }
  ]
}
```

Next, you can run the linter with the following to see the problems are found.

```sh
ng lint
```

## Configuration

There are several levels of configuration that can be implemented with this plugin. You can read more about it in the [plugin documentation page](https://github.com/timdeschryver/eslint-plugin-ngrx#configurations).
