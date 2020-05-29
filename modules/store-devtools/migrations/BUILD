load("//tools:defaults.bzl", "pkg_npm", "ts_library")

package(default_visibility = ["//visibility:public"])

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
    module_name = "@ngrx/store-devtools/migrations",
    deps = [
        "//modules/store-devtools/schematics-core",
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
