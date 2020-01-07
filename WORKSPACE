# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(name = "ngrx")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Rules for NodeJS
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "3d7296d834208792fa3b2ded8ec04e75068e3de172fae79db217615bd75a6ff7",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.39.1/rules_nodejs-0.39.1.tar.gz"],
)

# Rules for web testing
http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "f1f4d2c2f88d2beac64c82499a1e762b037966675dd892da89c87e39d72b33f6",
    urls = [
        "https://github.com/bazelbuild/rules_webtesting/releases/download/0.3.2/rules_webtesting.tar.gz",
    ],
)

# Rules for compiling sass
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "ad08e8c82aa1f48b72dc295cb83bba33f514cdf24cc7b0e21e9353f20f0dc147",
    strip_prefix = "rules_sass-5d1b26f8cd12c5d75dd359f9291090b341e8fd52",
    # We need to use a version that includes SHA 5d1b26f8cd12c5d75dd359f9291090b341e8fd52 of
    # the "rules_sass" repository as it adds support for workers.
    url = "https://github.com/bazelbuild/rules_sass/archive/5d1b26f8cd12c5d75dd359f9291090b341e8fd52.zip",
)

####################################
# Load and install our dependencies downloaded above.

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "yarn_install")

check_bazel_version(
    message = "The minimum bazel version to use with this repo is 1.0.0",
    minimum_bazel_version = "1.0.0",
)

yarn_install(
    name = "npm",
    data = ["//:angular-metadata.tsconfig.json"],
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

# Install all bazel dependencies of the @ngdeps npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup web testing
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)

# Setup TypeScript Bazel workspace
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

# Setup the Sass rule repositories
load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()
