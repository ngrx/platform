load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "store-devtools",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store-devtools",
    deps = [
        "//modules/store",
        "@npm//@angular/core",
        "@npm//rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/store-devtools/index.js",
    nested_packages = [
        "//modules/store-devtools/migrations:npm_package",
        "//modules/store-devtools/schematics:npm_package",
        "//modules/store-devtools/schematics-core:npm_package",
    ],
    deps = [
        ":store-devtools",
    ],
)
