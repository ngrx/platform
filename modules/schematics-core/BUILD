package(default_visibility = ["//visibility:public"])

load("@build_bazel_rules_typescript//:defs.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "npm_package")

ts_library(
    name = "schematics-core",
    srcs = glob(
        ["**/*.ts"],
        exclude = ["**/*.spec.ts"],
    ),
    module_name = "@ngrx/schematics-core",
    tsconfig = ":tsconfig-build.json",
)

npm_package(
    name = "npm_package",
    srcs = [
        ":package.json",
    ] + glob([
        "**/files/**/*",
        "**/data/**/*",
        "**/schema.json",
        "**/migration.json",
    ]),
    deps = [":schematics-core"],
)
