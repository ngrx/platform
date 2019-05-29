# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(name = "ngrx")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "abcf497e89cfc1d09132adfcd8c07526d026e162ae2cb681dcb896046417ce91",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.30.1/rules_nodejs-0.30.1.tar.gz"],
)

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "1c0900547bdbe33d22aa258637dc560ce6042230e41e9ea9dad5d7d2fca8bc42",
    urls = ["https://github.com/bazelbuild/rules_webtesting/releases/download/0.3.0/rules_webtesting.tar.gz"],
)

# Rules for compiling sass
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = "d8b89e47b05092a6eed3fa199f2de7cf671a4b9165d0bf38f12a0363dda928d3",
    strip_prefix = "rules_sass-1.14.1",
    url = "https://github.com/bazelbuild/rules_sass/archive/1.14.1.zip",
)

####################################
# Load and install our dependencies downloaded above.

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "yarn_install")

check_bazel_version(minimum_bazel_version = "0.26.0")

yarn_install(
    name = "npm",
    data = ["//:angular-metadata.tsconfig.json"],
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()

browser_repositories(
    chromium = True,
    firefox = True,
)

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()
