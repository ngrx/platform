"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library = "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", _jasmine_node_test = "jasmine_node_test")

def ts_library(tsconfig = None, node_modules = None, **kwargs):
  if not tsconfig:
    tsconfig = "//:tsconfig.json"
  if not node_modules:
    node_modules = "@ngrx_compiletime_deps//:node_modules"
  _ts_library(tsconfig = tsconfig, node_modules = node_modules, **kwargs)

def ts_test_library(node_modules = None, **kwargs):
  if not node_modules:
    node_modules = "//:ngrx_test_dependencies"
  ts_library(node_modules = node_modules, testonly = 1, **kwargs)

def jasmine_node_test(node_modules = None, bootstrap = None, deps = [], **kwargs):
  if not node_modules:
    node_modules = "//:ngrx_test_dependencies"
  if not bootstrap:
    bootstrap = ["ngrx/tools/testing/bootstrap_node_tests.js"]
  _jasmine_node_test(
      bootstrap = bootstrap,
      node_modules = node_modules,
      deps = ["//tools/testing:node"] + deps,
      **kwargs
  )
