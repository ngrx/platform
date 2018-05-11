package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ng_module", "ng_package")

ng_module(
    name = "store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store",
    deps = ["@rxjs"],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/store/index.js",
    packages = [
        "//modules/store/migrations:npm_package",
        "//modules/store/schematics-core:npm_package",
    ],
    deps = [
        ":store",
    ],
)
