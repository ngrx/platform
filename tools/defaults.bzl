"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library = "ts_library")

def ts_library(tsconfig = None, node_modules = None, **kwargs):
  if not tsconfig:
    tsconfig = "//:tsconfig.json"
  if not node_modules:
    node_modules = "@ngrx_compiletime_deps//:node_modules"
  _ts_library(tsconfig = tsconfig, node_modules = node_modules, **kwargs)
