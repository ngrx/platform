load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "effects",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/effects",
    visibility = ["//visibility:public"],
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)
