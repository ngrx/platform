load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "effects",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/effects",
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)
