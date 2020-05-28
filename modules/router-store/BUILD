load("//tools:defaults.bzl", "ng_module", "ng_package")

package(default_visibility = ["//visibility:public"])

ng_module(
    name = "router-store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/router-store",
    deps = [
        "//modules/store",
        "@npm//@angular/router",
        "@npm//rxjs",
    ],
)

ng_package(
    name = "npm_package",
    srcs = glob(["**/*.externs.js"]) + [
        "package.json",
    ],
    entry_point = "modules/router-store/index.js",
    nested_packages = [
        "//modules/router-store/migrations:npm_package",
        "//modules/router-store/schematics:npm_package",
        "//modules/router-store/schematics-core:npm_package",
    ],
    deps = [
        ":router-store",
    ],
)
