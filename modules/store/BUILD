load("//tools:defaults.bzl", "ng_module", "ng_package")

ng_module(
    name = "store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store",
    visibility = ["//visibility:public"],
    deps = ["@rxjs"],
)

ng_package(
    name = "npm_package",
    deps = [":store"],
    entry_point = "modules/store/index.js",
)
