load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "entity",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/entity",
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
    entry_point = "modules/entity/index.js",
    nested_packages = [
        "//modules/entity/migrations:npm_package",
        "//modules/entity/schematics:npm_package",
        "//modules/entity/schematics-core:npm_package",
    ],
    deps = [
        ":entity",
    ],
)
