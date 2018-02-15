load("//tools:defaults.bzl", "ts_library")

ts_library(
    name = "entity",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    module_name = "@ngrx/entity",
    deps = [
        "//modules/store",
        "@rxjs",
    ],
)
