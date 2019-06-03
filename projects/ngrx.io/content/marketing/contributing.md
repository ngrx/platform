<h1>Contributing</h1>

## Yarn Package Management Tool Prequisite

The NgRx library utilizes the `yarn` CLI tool. Please make sure that you have the latest stable release of `yarn` installed. 

## Contributing to the Library Modules

### Folder Structure

Source code for the NgRx library exists under the `modules/` project folder. If you are planning to contribute features and/or bug fixes relating to the library, chances are the code will be found in one of the `modules` sub-folders. These sub-folders mirror, for the most part, the `npm` packages for `@ngrx/*`:

- `modules/data` > `@ngrx/data`
- `modules/effects` > `@ngrx/effects`
- `modules/entity` > `@ngrx/entity`
- `modules/router-store` > `@ngrx/router-store`
- `modules/schematics` > `@ngrx/schematics`
- `modules/schematics-core` > `@ngrx/schematics-core`
- `modules/store` > `@ngrx/store`
- `modules/store-devtools` > `@ngrx/store-devtools`

Within each of these `modules/*` folders exists a standard and pertinent set of files and folders:

- `migrations` - With new releases, come new features and occasional breaking changes. We strive to create migrations, whenever possible for users to easily migrate to new versions. This folder will contain those version specific migration utility scripts.
- `schematics` - NgRx provides a fully featured set of schematics. This folder will contain those schematics specific to each module for use with `ng add` and `ng generate`.
- `schematics-core` - Utility functions to help with schematics.
- `spec` - All unit tests for the given module will exist under this folder. 
- `src` - This folder contains the actual module API features including private utility functions. 
- `src\index.ts` - This file is responsible for providing the public API surface layer. Only public API methods and models are exported from here.

### Setup

To ensure the correct project dependencies are installed, please run the following command before each new pull request (PR) is submitted. This command should be run from the root project folder.

```sh
yarn
```

### Testing

It is good practice to run the following command from the root project folder before pushing new commits.

```sh
yarn test
```

## Contributing to the Docs and NgRx.io Website

### Folder Structure
Source code for the NgRx docs and the ngrx.io website exist under the `projects/ngrx.io/content` folder. If you are planning contribute features and/or bug fixes relating to the docs or the website, chances are the code will be found there. The structure is split up between the following sub folders and key files:

- `projects/ngrx.io/content/examples` - Code examples referenced on the website and in the docs should be placed under this folder
- `projects/ngrx.io/content/guide` - The majority of official NgRx documentation exists under this folder. There are sub-folders for each module.
- `projects/ngrx.io/content/marketing` - The majority of the additional website pages such as resources, events, about the NgRx team exist under this folder.
- `projects/ngrx/io/content/events.json` - The Events page dynmically displays two tables, one for Past Events and one for Present events based on the contents of this file.
- `projects/ngrx/io/content/resources.json` - The Resources page dynmically displays a list of NgRx resources based on the contents of this file.
- `projects/ngrx/io/content/navigation.json` - All of the navigation and menus on the website and docs are populated from this json file. If a new page is being added, or adjusted make sure to update this file as well.

### Striving For Excellence

The NgRx team strives for excellence when it comes to documentation. Documentation should be free of typos, grammatical errors, slang, and vagueness. When contributing, please take special care to ensure that all new copy has been spell-checked and run through a third-party grammer checking service. This will speed up the time to merge, as well as, save time for the maintainers reviewing the PR.

### Setup

To ensure the correct project dependencies are installed, please run the following command before each new pull request (PR) is submitted. This command should be run from the `projects/ngrx.io` folder.

```sh
yarn setup
```

### Running Locally

It is recommended to run the docs and website locally before pushing commits to PR's. A `yarn` script is provided to launch the docs locally, watch for changes and reload automatically. The following command will do this all at once:

```sh
yarn serve-and-sync
```

After running this command, an instance of the website and docs will be available at `http://localhost:4200`

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews. If you don't you'll probably just be asked to anyway.**

- Please rebase your branch against the current master.
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

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the NgRx change log**.

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

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/ngrx/platform/commits/master))

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
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages.

The following is the list of supported scopes:

- **data**
- **effects**
- **entity**
- **example**
- **router-store**
- **schematics**
- **store**
- **store-devtools**

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
