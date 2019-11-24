# NgRx documentation project (https://ngrx.io)

Everything in this folder is part of the documentation project. This includes

- the web site for displaying the documentation
- the dgeni configuration for converting source files to rendered files that can be viewed in the web site.
- the tooling for setting up examples for development; and generating live-example and zip files from the examples.

## Developer tasks

We use [Yarn](https://yarnpkg.com) to manage the dependencies and to run build tasks.
You should run all these tasks from the `projects/ngrx.io` folder.
Here are the most important tasks you might need to use:

- `yarn` - install all the dependencies.
- `yarn setup` - install all the dependencies, boilerplate, stackblitz, zips and run dgeni on the docs.

- `yarn build` - create a production build of the application (after installing dependencies, boilerplate, etc).

- `yarn start` - run a development web server that watches the files; then builds the doc-viewer and reloads the page, as necessary.
- `yarn serve-and-sync` - run both the `docs-watch` and `start` in the same console.
- `yarn lint` - check that the doc-viewer code follows our style rules.
- `yarn test` - watch all the source files, for the doc-viewer, and run all the unit tests when any change.
- `yarn test --watch=false` - run all the unit tests once.
- `yarn e2e` - run all the e2e tests for the doc-viewer.

- `yarn docs` - generate all the docs from the source files.
- `yarn docs-watch` - watch the Angular source and the docs files and run a short-circuited doc-gen for the docs that changed.
- `yarn docs-lint` - check that the doc gen code follows our style rules.
- `yarn docs-test` - run the unit tests for the doc generation code.

- `yarn boilerplate:add` - generate all the boilerplate code for the examples, so that they can be run locally. Add the option
- `yarn boilerplate:remove` - remove all the boilerplate code that was added via `yarn boilerplate:add`.
- `yarn generate-stackblitz` - generate the stackblitz files that are used by the `live-example` tags in the docs.
- `yarn generate-zips` - generate the zip files from the examples. Zip available via the `live-example` tags in the docs.

- `yarn example-e2e` - run all e2e tests for examples

  - `yarn example-e2e --setup` - force webdriver update & other setup, then run tests
  - `yarn example-e2e --filter=foo` - limit e2e tests to those containing the word "foo"
  - `yarn example-e2e --setup --local` - run e2e tests with the local version of Angular contained in the "dist" folder

- `yarn build-ie-polyfills` - generates a js file of polyfills that can be loaded in Internet Explorer.

## Developing on Windows

It is necessary to run `yarn setup` and `yarn boilerplate:add` using Administrator rights as Linux-specific symlinks are used.

## Using ServiceWorker locally

Running `yarn start` (even when explicitly targeting production mode) does not set up the
ServiceWorker. If you want to test the ServiceWorker locally, you can use `yarn build` and then
serve the files in `dist/` with `yarn http-server dist -p 4200`.

## Running on Docker

The ngrx.io sample project can run as a docker container. 
In order to run ngrx.io on docker, use the following commands (**run commands from the platform folder**):
* `docker build -t ngrx-docs:7.4.0 .` - building the ngrx.io app image
* `docker run -p <host-port>:4200 ngrx-docs:7.4.0` - starting the container, listening on *<host-port>* for your choice.

The container will run the documentation app with the script `start:docker` with the **stable configuration** and with 0.0.0.0
host support.
* Saving the image for later offline usage is available by building the container and then using `sudo docker save ngrx-docs:7.4.0 > <tar-name>.tar`
and loading it afterwards with `sudo docker load < <tar-name>.tar`.
> tested on ubuntu 18.04.2 with Docker 18.09.4

## Guide to authoring

There are two types of content in the documentation:

- **API docs**: descriptions of the modules, classes, interfaces, decorators, etc that make up the Angular platform.
  API docs are generated directly from the source code.
  The source code is contained in TypeScript files, located in the `modules` folder.
  Each API item may have a preceding comment, which contains JSDoc style tags and content.
  The content is written in markdown.

- **Other content**: guides, tutorials, and other marketing material.
  All other content is written using markdown in text files, located in the `projects/ngrx.io/content` folder.
  More specifically, there are sub-folders that contain particular types of content: guides, and marketing.

- **Code examples**: code examples need to be testable to ensure their accuracy.
  Also, our examples have a specific look and feel and allow the user to copy the source code. For larger
  examples they are rendered in a tabbed interface (e.g. template, HTML, and TypeScript on separate
  tabs).

We use the [dgeni](https://github.com/angular/dgeni) tool to convert these files into docs that can be viewed in the doc-viewer.

### Generating the complete docs

The main task for generating the docs is `yarn docs`. This will process all the source files (API and other),
extracting the documentation and generating JSON files that can be consumed by the doc-viewer.

### Partial doc generation for editors

Full doc generation can take up to one minute. That's too slow for efficient document creation and editing.

You can make small changes in a smart editor that displays formatted markdown:

> In VS Code, _Cmd-K, V_ opens markdown preview in side pane; _Cmd-B_ toggles left sidebar

You also want to see those changes displayed properly in the doc viewer
with a quick, edit/view cycle time.

For this purpose, use the `yarn docs-watch` task, which watches for changes to source files and only
re-processes the files necessary to generate the docs that are related to the file that has changed.
Since this task takes shortcuts, it is much faster (often less than 1 second) but it won't produce full
fidelity content. For example, links to other docs and code examples may not render correctly. This is
most particularly noticed in links to other docs and in the embedded examples, which may not always render
correctly.

The general setup is as follows:

- Open a terminal, ensure the dependencies are installed; run an initial doc generation; then start the doc-viewer:

```bash
yarn setup
yarn start
```

- Open a second terminal and start watching the docs

```bash
yarn docs-watch
```

> Alternatively, try the consolidated `serve-and-sync` command that builds, watches and serves in the same terminal window

```bash
yarn serve-and-sync
```

- Open a browser at https://localhost:4200/ and navigate to the document on which you want to work.
  You can automatically open the browser by using `yarn start -o` in the first terminal.

- Make changes to the page's associated doc or example files. Every time a file is saved, the doc will
  be regenerated, the app will rebuild and the page will reload.
