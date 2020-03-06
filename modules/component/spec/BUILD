load("//tools:defaults.bzl", "jasmine_node_test", "ts_test_library")

ts_test_library(
    name = "test_lib",
    srcs = glob(
        [
            "**/*.ts",
        ],
    ),
    deps = [
        "//modules/component",
        # TODO: @ngrx/component - add ngrx deps
        # "//modules/store",
        "@npm//@angular/common",
        "@npm//rxjs",
    ],
)

jasmine_node_test(
    name = "test",
    deps = [
        ":test_lib",
        # TODO: @ngrx/component - add ngrx deps
        # "//modules/store",
    ],
)
