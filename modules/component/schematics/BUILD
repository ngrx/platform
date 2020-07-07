load("//tools:defaults.bzl", "pkg_npm", "ts_library")

package(default_visibility = ["//visibility:public"])

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
    module_name = "@ngrx/component/schematics",
    deps = [
        "//modules/component/schematics-core",
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
