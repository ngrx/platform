# Using Store with Angular Elements
## Creating Angular Elements
The following recipe shows you how to manage the state of a counter, and how to select and display it within an Angular Elements and use the same within an Angular Project and a static page.
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
3. The only difference here is split the code for increment, decrement and reset in the sepearate component.
4. Rename `app.module.ts` to `counter.module.ts` file and add the below code.
<code-example header="src/lib/counter.module.ts" path="store-elements/projects/my-counter/src/lib/counter.module.ts">
</code-example>
In the above code, we have added all the components in `entryComponents` array as we need to render these components as Angular Elements.
Also inside `constructor` you may notice `createCustomElement`, this is used to register the Angular Components as Angular Elements.

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
ng build my-counter && ng serve - project=elementApp -o
```

### Using with Static Page

1. For building a custom-element.js file which can be used outside an Angular App. Go to `counterelement` App and add the below code in `app.module.ts`.
<code-example header="counterelement/src/app/app.module.ts" path="store-elements/projects/counterelement/src/app/app.module.ts">
</code-example>
In the above code, you may notice we are not using any component inside the `bootstrap` array, as we are going to bootstrap our app manually using `ngDoBootstrap`. By making this change we will create a `counter-element.js` file which we can use inside any static page.
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
5. Run the following command to build and package your custom element into a single js file.
```sh
npm run build-element
npm run package
```
6. Move to `htmlapp` folder and run `http-server` make sure you have `http-server` installed globally.