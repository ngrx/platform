load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "selectors",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/selectors",
    deps = [
        "//modules/store",
        "@npm//@angular-devkit/schematics",
        "@npm//@angular/core",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/selectors/index.js",
    nested_packages = [
        "//modules/selectors/migrations:npm_package",
        "//modules/selectors/schematics:npm_package",
        "//modules/selectors/schematics-core:npm_package",
    ],
    deps = [
        ":selectors",
    ],
)
