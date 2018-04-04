package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library", "npm_package")

ts_library(
    name = "schematics",
    srcs = glob(["src/*/*.ts"]),
    module_name = "@ngrx/schematics",
)

filegroup(
    name = "schematics_templates",
    srcs = glob([
        "src/*/files/**/*.ts",
        "src/*/schema.json",
    ]),
)

npm_package(
    name = "npm_package",
    srcs = [":schematics_templates"] + glob([
        "collection.json",
        "package.json",
        "README.md",
    ]),
    deps = [
        ":schematics",
    ],
)
