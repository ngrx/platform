package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ng_module", "ng_package")

ng_module(
    name = "component",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/component",
    deps = [
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//rxjs",
        "@npm//typescript",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/component/index.js",
    packages = [
    ],
    deps = [
        ":component",
    ],
)
