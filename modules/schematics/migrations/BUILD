package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "npm_package", "ts_library")

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
    module_name = "@ngrx/schematics/migrations",
    deps = [
        "//modules/schematics/schematics-core",
        "@npm//@angular-devkit/schematics",
    ],
)

npm_package(
    name = "npm_package",
    srcs = [
        ":migration.json",
    ],
    deps = [
        ":migrations",
    ],
)
