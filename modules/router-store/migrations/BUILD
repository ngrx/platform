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
    module_name = "@ngrx/router-store/migrations",
    deps = [
        "//modules/router-store/schematics-core",
        "@npm//@angular-devkit/schematics",
        "@npm//typescript",
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
