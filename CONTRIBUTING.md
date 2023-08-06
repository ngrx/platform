# Developing

## Getting started with GitHub Codespaces

To get started, create a codespace for this repository by clicking this 👇

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=83716883)

A codespace will open in a web-based version of Visual Studio Code. The [dev container](.devcontainer/devcontainer.json) is fully configured with software needed for this project.

**Note**: Dev containers is an open spec which is supported by [GitHub Codespaces](https://github.com/codespaces) and [other tools](https://containers.dev/supporting).

## Setup

```shell
yarn
```

## Testing

```shell
yarn test
```

### Testing for a specific library

```shell
yarn nx test effects --watchAll
yarn nx test <library name that matches angular.json entry> --watchAll
```

### Testing for a specific schematic unit test

```shell
yarn jest modules/schematics/src/effect/index.spec.ts --watch
yarn jest <relative path> --watch
```

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews. If you don't you'll probably just be asked to anyway.**

- Please rebase your branch against the current main.
- Run the `Setup` command to make sure your development dependencies are up-to-date.
- Please ensure the test suite passes before submitting a PR.
- If you've added new functionality, **please** include tests which validate its behavior.
- Make reference to possible [issues](https://github.com/ngrx/platform/issues) on PR comment.

## Submitting bug reports

- Search through issues to see if a previous issue has already been reported and/or fixed.
- Provide a _small_ reproduction using a [StackBlitz project](https://stackblitz.com/edit/ngrx-seed) or a GitHub repository.
- Please detail the affected browser(s) and operating system(s).
- Please be sure to state which version of Angular, node and npm you're using.

## Submitting new features

- We value keeping the API surface small and concise, which factors into whether new features are accepted.
- Submit an issue with the prefix `RFC:` with your feature request.
- The feature will be discussed and considered.
- Once the PR is submitted, it will be reviewed and merged once approved.

## Questions and requests for support

Questions and requests for support should not be opened as issues and should be handled in the following ways:

- Start a new [Q&A Discussion](https://github.com/ngrx/platform/discussions/new?category=q-a) on GitHub.
- Ask a question on [StackOverflow](https://stackoverflow.com/questions/tagged/ngrx) using the `ngrx` tag.
- Join our [Discord server](https://discord.com/invite/ngrx).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the NgRx changelog**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/ngrx/platform/commits/main))

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:

- **component**
- **component-store**
- **data**
- **effects**
- **entity**
- **example**
- **router-store**
- **schematics**
- **store**
- **store-devtools**
- **eslint-plugin**

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

Example:

```
feat(scope): commit message

BREAKING CHANGES:

Describe breaking changes here

BEFORE:

Previous code example here

AFTER:

New code example here
```

## Financial Contributions

We also welcome sponsorships through [GitHub Sponsors](https://github.com/sponsors/ngrx). Sponsorships aid in the continued development of NgRx libraries, along with supporting core contributors on the project. If you are looking for more hands-on support such as training or workshops, check out our [Enterprise Support](https://ngrx.io/enterprise-support) page.

Thank you to all the people who have already contributed to NgRx!
