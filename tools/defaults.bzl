"""Re-export of some bazel rules with repository-wide defaults."""

load("@build_bazel_rules_nodejs//:defs.bzl", _npm_package = "npm_package")
load("@npm_angular_bazel//:index.bzl", _ng_module = "ng_module", _ng_package = "ng_package")
load("@npm_bazel_jasmine//:index.bzl", _jasmine_node_test = "jasmine_node_test")
load("@npm_bazel_typescript//:index.bzl", _ts_library = "ts_library")

DEFAULT_TSCONFIG = "//:tsconfig.json"
NG_VERSION = "^8.0.0"
RXJS_VERSION = "^6.4.0"
NG_UPDATE_MIGRATIONS = "./migrations/migration.json"
MODULE_SCHEMATICS_COLLECTION = "./schematics/collection.json"

NGRX_SCOPED_PACKAGES = ["@ngrx/%s" % p for p in [
    "store",
    "effects",
    "entity",
    "router-store",
    "data",
    "schematics",
    "store-devtools",
]]

PKG_GROUP_REPLACEMENTS = {
    "\"NG_UPDATE_PACKAGE_GROUP\"": """[
      %s
    ]""" % ",\n      ".join(["\"%s\"" % s for s in NGRX_SCOPED_PACKAGES]),
    "MODULE_SCHEMATICS_COLLECTION": MODULE_SCHEMATICS_COLLECTION,
    "NG_UPDATE_MIGRATIONS": NG_UPDATE_MIGRATIONS,
    "NG_VERSION": NG_VERSION,
    "RXJS_VERSION": RXJS_VERSION,
}

# Convert a package name on npm to an identifier that's a legal global id
# @ngrx/store -> ngrx.store
# @ngrx/router-store -> ngrx.routerStore
def _global_name(package_name):
    # strip npm scoped package qualifier
    start = 1 if package_name.startswith("@") else 0
    parts = package_name[start:].split("/")
    result_parts = []
    for p in parts:
        # convert dash case to camelCase
        # First letter in the result is always unchanged
        result = p[0] + "".join([p2.title() for p2 in p.split("-")])[1:]
        result_parts.append(result)
    return ".".join(result_parts)

NGRX_GLOBALS = dict({
    "tslib": "tslib",
}, **{p: _global_name(p) for p in NGRX_SCOPED_PACKAGES})

def ts_library(tsconfig = None, node_modules = None, deps = [], **kwargs):
    if not tsconfig:
        tsconfig = DEFAULT_TSCONFIG
    _ts_library(
        tsconfig = tsconfig,
        deps = [
            "@npm//@types",
        ] + deps,
        **kwargs
    )

def ts_test_library(node_modules = None, deps = [], **kwargs):
    ts_library(
        testonly = 1,
        deps = [
            "@npm//@angular/core",
            "@npm//@angular/platform-server",
            "@npm//jasmine-marbles",
            "@npm//zone.js",
        ] + deps,
        **kwargs
    )

def jasmine_node_test(node_modules = None, bootstrap = None, deps = [], **kwargs):
    if not bootstrap:
        bootstrap = ["ngrx/tools/testing/bootstrap_node_tests.js"]
    _jasmine_node_test(
        bootstrap = bootstrap,
        deps = [
            "//tools/testing:node",
            # Very common dependencies for tests
            "@npm//chokidar",
            "@npm//core-js",
            "@npm//deep-freeze",
            "@npm//domino",
            "@npm//jasmine",
            "@npm//jasmine-core",
            "@npm//reflect-metadata",
            "@npm//source-map-support",
            "@npm//tslib",
            "@npm//xhr2",
        ] + deps,
        **kwargs
    )

def ng_module(name, tsconfig = None, entry_point = None, deps = [], **kwargs):
    if not tsconfig:
        tsconfig = DEFAULT_TSCONFIG
    if not entry_point:
        entry_point = "public_api.ts"
    _ng_module(
        name = name,
        flat_module_out_file = name,
        tsconfig = tsconfig,
        entry_point = entry_point,
        deps = [
            "@npm//@types",
        ] + deps,
        **kwargs
    )

def ng_package(name, readme_md = None, license_banner = None, globals = {}, **kwargs):
    if not readme_md:
        readme_md = "//modules:README.md"
    if not license_banner:
        license_banner = "//modules:license-banner.txt"

    _ng_package(
        name = name,
        readme_md = readme_md,
        license_banner = license_banner,
        globals = dict(globals, **NGRX_GLOBALS),
        replacements = PKG_GROUP_REPLACEMENTS,
        **kwargs
    )

def npm_package(name, replacements = {}, **kwargs):
    _npm_package(
        name = name,
        replacements = dict(replacements, **PKG_GROUP_REPLACEMENTS),
        **kwargs
    )
