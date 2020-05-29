load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "data",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/data",
    deps = [
        "//modules/effects",
        "//modules/entity",
        "//modules/store",
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/data/index.js",
    nested_packages = [
        "//modules/data/migrations:npm_package",
        "//modules/data/schematics:npm_package",
        "//modules/data/schematics-core:npm_package",
    ],
    deps = [
        ":data",
    ],
)
