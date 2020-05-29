load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store",
    deps = [
        "@npm//@angular/core",
        "@npm//rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
        "//modules/store/testing:package.json",
    ],
    entry_point = "modules/store/index.js",
    nested_packages = [
        "//modules/store/migrations:npm_package",
        "//modules/store/schematics:npm_package",
        "//modules/store/schematics-core:npm_package",
    ],
    deps = [
        ":store",
        "//modules/store/testing",
    ],
)
