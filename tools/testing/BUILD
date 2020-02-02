load("//tools:defaults.bzl", "ts_library")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "node",
    srcs = ["bootstrap_node_tests.ts"],
    deps = [
        "@npm//@angular/core",
        "@npm//@angular/platform-server",
        "@npm//zone.js",
    ],
)
