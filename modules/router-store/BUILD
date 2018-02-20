load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "router-store",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/router-store",
    visibility = ["//visibility:public"],
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)
