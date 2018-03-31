load("//tools:defaults.bzl", "ts_test_library", "jasmine_node_test")

ts_test_library(
    name = "test_lib",
    srcs = glob(
        [
            "**/*.ts",
        ],
    ),
    deps = [
        "//modules/entity",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
        "//modules/entity",
    ],
)
