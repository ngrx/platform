package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "pkg_npm", "ts_library")

ts_library(
    name = "migrations",
    srcs = glob(
        [
            "**/*.ts",
        ],
        exclude = [
            "**/testing/*.ts",
            "**/*.spec.ts",
        ],
    ),
    module_name = "@ngrx/data/migrations",
    deps = [
        "//modules/data/schematics-core",
        "@npm//@angular-devkit/schematics",
    ],
)

pkg_npm(
    name = "npm_package",
    srcs = [
        ":migration.json",
    ],
    deps = [
        ":migrations",
    ],
)
