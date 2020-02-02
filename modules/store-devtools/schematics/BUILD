package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "pkg_npm", "ts_library")

ts_library(
    name = "schematics",
    srcs = glob(
        [
            "**/*.ts",
        ],
        exclude = [
            "**/*.spec.ts",
            "**/files/**/*",
        ],
    ),
    module_name = "@ngrx/store-devtools/schematics",
    deps = [
        "//modules/store-devtools/schematics-core",
        "@npm//@angular-devkit/core",
        "@npm//@angular-devkit/schematics",
        "@npm//typescript",
    ],
)

pkg_npm(
    name = "npm_package",
    srcs = [
        ":collection.json",
    ] + glob([
        "**/files/**/*",
        "**/schema.json",
    ]),
    deps = [
        ":schematics",
    ],
)
