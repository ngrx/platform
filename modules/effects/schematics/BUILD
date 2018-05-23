package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library", "npm_package")

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
    module_name = "@ngrx/effects/schematics",
    deps = [
        "//modules/effects/schematics-core",
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
