load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "{{MODULE_NAME_KEBAB}}",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/{{MODULE_NAME_KEBAB}}",
    deps = [
        "//modules/store",
        "@npm//@angular-devkit/schematics",
        "@npm//@angular/core",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/{{MODULE_NAME_KEBAB}}/index.js",
    nested_packages = [
        "//modules/{{MODULE_NAME_KEBAB}}/migrations:npm_package",
        "//modules/{{MODULE_NAME_KEBAB}}/schematics:npm_package",
        "//modules/{{MODULE_NAME_KEBAB}}/schematics-core:npm_package",
    ],
    deps = [
        ":{{MODULE_NAME_KEBAB}}",
    ],
)
