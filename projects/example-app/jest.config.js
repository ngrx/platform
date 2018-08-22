module.exports = {
  "rootDir": ".",
  "setupTestFrameworkScriptFile": "<rootDir>/src/setup-jest.ts",
  "globals": {
    "ts-jest": {
      "tsConfigFile": "projects/example-app/tsconfig.spec.json"
    },
    "__TRANSFORM_HTML__": true
  },
  "transform": {
    "^.+\\.(ts|js|html)$": "<rootDir>/../../node_modules/jest-preset-angular/preprocessor.js"
  },
  "testMatch": [
    "<rootDir>/**/*.spec.ts"
  ],
  "moduleFileExtensions": [
    "ts",
    "js",
    "html",
    "json"
  ],
  "mapCoverage": true,
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/modules/*.*/"
  ],
  "moduleNameMapper": {
    "^@ngrx/(?!db)(.*)": "<rootDir>/../../modules/$1"
  },
  "transformIgnorePatterns": [
    "node_modules/(?!@ngrx)"
  ],
  "modulePathIgnorePatterns": [
    "dist"
  ]
};
