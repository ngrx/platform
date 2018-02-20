load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "testing",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/effects/testing",
    visibility = ["//visibility:public"],
    deps = [
        "//modules/effects",
        "@rxjs",
    ],
)
