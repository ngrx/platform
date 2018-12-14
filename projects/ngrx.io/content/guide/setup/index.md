# Installing NgRx for your Angular Project

NgRx can be installed via npm or yarn. At a bare minimum `@ngrx/store` must be installed in order
to use the framework. 

## Npm
```sh
$ npm install --save @ngrx/store
$ npm install --save @ngrx/effects
$ npm install --save @ngrx/entity
$ npm install --save @ngrx/router-store
$ npm install --save-dev @ngrx/store-devtools
$ npm install --save-dev @ngrx/schematics
```

## Yarn
```sh
$ yarn add @ngrx/store
$ yarn add @ngrx/effects
$ yarn add @ngrx/entity
$ yarn add @ngrx/router-store
$ yarn add --dev @ngrx/store-devtools
$ yarn add --dev @ngrx/schematics
```

In addition there is a one stop install command for all the ngrx dependencies.

```sh
$ npm install --save @ngrx/{store,effects,entity,router-store,store-devtools,schematics}

//if Yarn
$ yarn add @ngrx/{store,effects,entity,router-store,store-devtools,schematics}
```

Note that `store-devtools` and `schematics` will be installed as a dependency and not a 
dev-dependency in this case.
To fix simply exclude the the mentioned modules in the above command and install separately.
Additionally for projects that are not certain ngrx modules like `entity` or `router-store`, the 
modules can be excluded from the install command.

