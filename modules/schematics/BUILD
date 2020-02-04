package(default_visibility = ["//visibility:public"])

load("//tools:defaults.bzl", "jasmine_node_test", "pkg_npm", "ts_library", "ts_test_library")

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
        "@npm//@angular-devkit/core",
        "@npm//@angular-devkit/schematics",
        "@npm//typescript",
    ],
)

pkg_npm(
    name = "npm_package",
    srcs = [
        ":collection.json",
        ":package.json",
        ":README.md",
    ] + glob([
        "**/src/*/files/**/*",
        "**/src/*/common-files/**/*",
        "**/src/*/creator-files/**/*",
        "**/src/*/integration-files/**/*",
        "**/schema.json",
        "**/migration.json",
    ]),
    nested_packages = [
        "//modules/schematics/migrations:npm_package",
        "//modules/schematics/schematics-core:npm_package",
    ],
    deps = [
        ":schematics",
    ],
)

ts_test_library(
    name = "test_lib",
    srcs = glob(
        [
            "**/*.spec.ts",
        ],
    ),
    data = glob([
        "**/src/*/files/**/*",
        "**/src/*/common-files/**/*",
        "**/src/*/creator-files/**/*",
        "**/src/*/integration-files/**/*",
        "**/*.json",
    ]),
    deps = [
        ":schematics",
        "//modules/schematics-core",
        "@npm//@angular-devkit/core",
        "@npm//@angular-devkit/schematics",
        "@npm//@schematics/angular",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
    ],
)
