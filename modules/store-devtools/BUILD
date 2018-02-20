load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "store-devtools",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/store-devtools",
    visibility = ["//visibility:public"],
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)
