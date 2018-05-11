package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library")
load("//tools:defaults.bzl", "npm_package")

ts_library(
    name = "schematics-core",
    srcs = glob(
        [
            "**/*.ts",
        ],
        exclude = [
            "**/testing/**/*.ts",
            "**/*spec.ts",
        ],
    ),
    module_name = "@ngrx/store/schematics-core",
)

npm_package(
    name = "npm_package",
    srcs = [],
    deps = [
        ":schematics-core",
    ],
)
