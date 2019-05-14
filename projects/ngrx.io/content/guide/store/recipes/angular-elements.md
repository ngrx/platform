# Using Store with Angular Elements
## Creating Angular Elements
The following recipe  illustrates utilizing Angular Elements with a NgRx Store to manage the state of a counter, and select and display that counter state from within separate Angular Elements. All from within a single Angular Project and a static HTML page.
## Recipe
You can download  <live-example name="store-elements" downloadOnly>Angular Elements Project</live-example>.

1. Create a new application by running the below command
```sh
ng new ngRxElementDemo - createApplication=false
```

### Creating Library

1. Create a new Angular Library using below command
```sh
ng g library my-counter
```
2. Follow the instructions in the [Getting Started Guide](guide/store#installation) to create a new counter store complete with actions, reducer, and module.
3. The only difference here is to split the code for increment, decrement and reset into sepearate component.
4. Rename `app.module.ts` to `counter.module.ts` file and add the below code.
<code-example header="src/lib/counter.module.ts" path="store-elements/projects/my-counter/src/lib/counter.module.ts">
</code-example>
In the above code, we have added all the components in `entryComponents` array.This ensures the components are available for rendering as Angular Elements.In addition, inside the `constructor`, `createCustomElement` must be called for each component that will be used as an Angular Element.

### Creating Applications

1. Generate two (2) new applications within the project using the below command
```sh
ng g application elementApp
ng g application counterelement
```
2. Run the below command to add Angular Element as a dependency to our project.
```sh
ng add @angular/elements
```
3. Once the command is completed, you will notice below changes in `angular.json`, the above package only makes changes to default project which in our case is `elementApp`, so copy the below line and add the same to the scripts section of `counterelement`
```json
"scripts": [
{"input": "node_modules/document-register-element/build/document-register-element.js"}
]
```

### Using With Angular Application

1. Within elementApp add the below code in `app.module.ts`.
<code-example header="elementApp/src/app/app.module.ts" path="store-elements/projects/elementApp/src/app/app.module.ts">
</code-example>
In the above code, we have imported `CounterModule` from our `my-counter` library and in `schemas` array we have added `CUSTOM_ELEMENTS_SCHEMA` because we are loading Custom Elements in our App.
2. Add the below code in `app.component.html`.
<code-example header="elementApp/src/app/app.component.html" path="store-elements/projects/elementApp/src/app/app.component.html">
</code-example>
Here we are using the Angular Elements, which we registered in our `my-counter` library.
3. Run the below command and import the code given in `polyfills.ts` file available in both the app created.
```sh
npm i @webcomponents/webcomponentsjs -save
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
```
The above polyfill is required to support Custom Elements for older browser.
4. Verify the app by running it locally using below command.
```sh
ng build my-counter && ng serve --project=elementApp -o
```

### Using with Static Page

1. In order to build the `custom-element.js` file, which can be used outside an Angular App, go to the `counterelement` app and add the below code in `app.module.ts`.
<code-example header="counterelement/src/app/app.module.ts" path="store-elements/projects/counterelement/src/app/app.module.ts">
</code-example>
In the above code, you may notice we are not using any component inside the `bootstrap` array. This is because we are going to bootstrap our app manually using `ngDoBootstrap`. This allows us to create a `counter-element.js` file which we can use inside any static page.
2. Run the below commands to install a package to merge files to create `custom-element.js` file.
```sh
npm install jscat - save-dev
```
3. Add a new folder `htmlapp` in the root, create a new file named `index.html` and add the below code.
<code-example header="htmlapp/index.html" path="store-elements/htmlapp/index.html">
</code-example>
4. Add two (2) new commands to the `scripts` section of `package.json`.
```json
"build-element": "ng build my-counter && ng build - project=counterelement - prod - output-hashing=none",
"package": "jscat ./dist/counterelement/runtime.js ./dist/counterelement/polyfills.js ./dist/counterelement/scripts.js ./dist/counterelement/main.js > htmlapp/counter-element.js",
```
5. Run the following commands to build and package your custom element into a single `.js` file.
```sh
npm run build-element
npm run package
```
6. Install `http-server` globally by using below command. Read more about `http-server` package on [github](https://github.com/indexzero/http-server).
```sh
npm i -g http-server
```
7. Move to `htmlapp` folder and run `http-server`, to see Angular Elements with NgRx in action on a static page.