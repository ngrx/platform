package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "npm_package", "ts_library")

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
    ],
)

npm_package(
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
