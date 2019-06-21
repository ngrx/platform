package(default_visibility = ["//visibility:public"])

exports_files(["package.json"])

load("//tools:defaults.bzl", "ng_module")

ng_module(
    name = "fixtures",
    srcs = glob([
        "*.ts",
        "src/**/*.ts",
    ]),
    visibility = ["//visibility:public"],
    deps = [
        "//modules/store",
    ],
)
