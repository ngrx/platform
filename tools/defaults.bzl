"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library="ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl",
     _jasmine_node_test="jasmine_node_test")


def ts_library(tsconfig=None, node_modules=None, **kwargs):
    if not tsconfig:
        tsconfig = "//:tsconfig.json"
    _ts_library(tsconfig=tsconfig, **kwargs)


def ts_test_library(node_modules=None, **kwargs):
    ts_library(testonly=1, **kwargs)


def jasmine_node_test(node_modules=None, bootstrap=None, deps=[], **kwargs):
    if not bootstrap:
        bootstrap = ["ngrx/tools/testing/bootstrap_node_tests.js"]
    _jasmine_node_test(
        bootstrap=bootstrap,
        deps=["//tools/testing:node"] + deps,
        **kwargs
    )
