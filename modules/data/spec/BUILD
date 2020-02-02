load("//tools:defaults.bzl", "jasmine_node_test", "ts_test_library")

ts_test_library(
    name = "test_lib",
    srcs = glob(
        [
            "**/*.ts",
        ],
    ),
    deps = [
        "//modules/data",
        "//modules/effects",
        "//modules/effects/testing",
        "//modules/entity",
        "//modules/store",
        "@npm//@angular/common",
        "@npm//rxjs",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
    ],
)
