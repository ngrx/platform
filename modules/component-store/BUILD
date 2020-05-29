load("//tools:defaults.bzl", "ng_package", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "component-store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/component-store",
    deps = [
        "@npm//rxjs",
        "@npm//tslib",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/component-store/index.js",
    deps = [
        ":component-store",
    ],
)
