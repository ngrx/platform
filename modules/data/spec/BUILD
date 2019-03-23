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
        "//modules/store",
        "//modules/effects",
        "//modules/effects/testing",
        "//modules/entity",
        "@rxjs",
        "@rxjs//operators",
        "@angular//packages/common/http",
        "@angular//packages/common/http/testing",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
        "//modules/data",
        "//modules/store",
        "//modules/effects",
        "//modules/entity",
    ],
)
