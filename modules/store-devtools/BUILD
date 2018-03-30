package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library", "ng_module", "ng_package")

ng_module(
    name = "store-devtools",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store-devtools",
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/store-devtools/index.js",
    deps = [
        ":store-devtools",
    ],
)
