package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "ts_library", "npm_package")

ts_library(
    name = "schematics",
    srcs = glob(
        [
            "**/src/**/*.ts",
        ],
        exclude = [
            "**/src/**/*.spec.ts",
            "**/src/**/files/**/*",
        ],
    ),
    module_name = "@ngrx/schematics",
    tsconfig = ":tsconfig-build.json",
    deps = [
        "//modules/schematics/schematics-core",
    ],
)

npm_package(
    name = "npm_package",
    srcs = [
        ":collection.json",
        ":package.json",
        ":README.md",
    ] + glob([
        "**/src/*/files/**/*",
        "**/schema.json",
        "**/migration.json",
    ]),
    packages = [
        "//modules/schematics/migrations:npm_package",
        "//modules/schematics/schematics-core:npm_package",
    ],
    deps = [
        ":schematics",
    ],
)
