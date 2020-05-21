load("//tools:defaults.bzl", "ts_jest_test")

ts_jest_test(
    name = "test",
    srcs = glob(
        [
            "**/*.ts",
        ],
    ),
    deps = [
        "//modules/component-store",
        "@npm//rxjs",
        "@npm//rxjs-marbles",
    ],
)
