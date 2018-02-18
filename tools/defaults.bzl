"""Re-export of some bazel rules with repository-wide defaults."""
load("@build_bazel_rules_typescript//:defs.bzl", _ts_library = "ts_library")
load("@angular//:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package")

DEFAULT_NODE_MODULES = "@ngrx_compiletime_deps//:node_modules"

def ts_library(tsconfig = None, node_modules = None, **kwargs):
  if not tsconfig:
    tsconfig = "//:tsconfig.json"
  if not node_modules:
    node_modules = DEFAULT_NODE_MODULES
  _ts_library(tsconfig = tsconfig, node_modules = node_modules, **kwargs)

def ng_module(tsconfig = None, node_modules = None, **kwargs):
  if not tsconfig:
    tsconfig = "//:tsconfig.json"
  if not node_modules:
    node_modules = DEFAULT_NODE_MODULES
  _ng_module(tsconfig = tsconfig, node_modules = node_modules, **kwargs)

def ng_package(node_modules = None, **kwargs):
  if not node_modules:
    node_modules = DEFAULT_NODE_MODULES
  _ng_package(node_modules = node_modules, **kwargs)