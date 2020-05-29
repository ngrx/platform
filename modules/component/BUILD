load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "component",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/component",
    deps = [
        # TODO: @ngrx/component - add ngrx deps, also add it to package.json as peerDependency
        # "//modules/store",
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/component/index.js",
    nested_packages = [
        # TODO: @ngrx/component - add schematic
        # "//modules/component/schematics-core:npm_package",
    ],
    deps = [
        ":component",
    ],
)
