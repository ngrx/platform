package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ng_module", "ng_package")

ng_module(
    name = "data",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/data",
    deps = [
        "//modules/store",
        "//modules/effects",
        "//modules/entity",
        "@angular//packages/core",
        "@angular//packages/common/http",
        "@rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/data/index.js",
    packages = [
    ],
    deps = [
        ":data",
    ],
)
