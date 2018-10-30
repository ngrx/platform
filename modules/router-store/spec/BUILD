load("//tools:defaults.bzl", "jasmine_node_test", "ts_test_library")

ts_test_library(
    name = "test_lib",
    srcs = glob(
        [
            "**/*.ts",
        ],
    ),
    deps = [
        "//modules/router-store",
        "//modules/store",
        "@angular//packages/router",
        "@angular//packages/router/testing",
        "@rxjs",
        "@rxjs//operators",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
        "//modules/router-store",
        "//modules/store",
    ],
)
