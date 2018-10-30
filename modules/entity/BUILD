package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ng_module", "ng_package")

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
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/entity/index.js",
    packages = [
        "//modules/entity/migrations:npm_package",
        "//modules/entity/schematics-core:npm_package",
    ],
    deps = [
        ":entity",
    ],
)
