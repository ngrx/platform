package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ng_module", "pkg_npm")

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

pkg_npm(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    nested_packages = [
        "//modules/data/migrations:npm_package",
        "//modules/data/schematics:npm_package",
        "//modules/data/schematics-core:npm_package",
    ],
    deps = [
        ":data",
    ],
)
