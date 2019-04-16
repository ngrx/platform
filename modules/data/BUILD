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
    packages = [
    ],
    deps = [
        ":data",
    ],
)
