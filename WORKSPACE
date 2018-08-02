# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(name = "ngrx")

####################################
# Fetch and install the NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "634206524d90dc03c52392fa3f19a16637d2bcf154910436fe1d669a0d9d7b9c",
    strip_prefix = "rules_nodejs-0.10.1",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.10.1.zip",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "4fb0dca8c9a90547891b7ef486592775a523330fc4555c88cd8f09270055c2ce",
    strip_prefix = "rules_webtesting-7ffe970bbf380891754487f66c3d680c087d67f2",
    url = "https://github.com/bazelbuild/rules_webtesting/archive/7ffe970bbf380891754487f66c3d680c087d67f2.zip",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

check_bazel_version("0.14.0")

node_repositories(
    package_json = ["//:package.json"],
    preserve_symlinks = True,
)

####################################
# Fetch and install the TypeScript rules
http_archive(
    name = "build_bazel_rules_typescript",
    sha256 = "3792cc20ef13bb1d1d8b1760894c3320f02a87843e3a04fed7e8e454a75328b6",
    strip_prefix = "rules_typescript-0.15.1",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.15.1.zip",
)

load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()

####################################
# The Bazel buildtools repo contains tools like the BUILD file formatter, buildifier
# This commit matches the version of buildifier in angular/ngcontainer
# If you change this, also check if it matches the version in the angular/ngcontainer
# version in /.circleci/config.yml
BAZEL_BUILDTOOLS_VERSION = "82b21607e00913b16fe1c51bec80232d9d6de31c"

http_archive(
    name = "com_github_bazelbuild_buildtools",
    sha256 = "edb24c2f9c55b10a820ec74db0564415c0cf553fa55e9fc709a6332fb6685eff",
    strip_prefix = "buildtools-%s" % BAZEL_BUILDTOOLS_VERSION,
    url = "https://github.com/bazelbuild/buildtools/archive/%s.zip" % BAZEL_BUILDTOOLS_VERSION,
)

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "feba3278c13cde8d67e341a837f69a029f698d7a27ddbb2a202be7a10b22142a",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.10.3/rules_go-0.10.3.tar.gz",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

####################################
# Fetching the Bazel source allows us to compile the Skylark linter
# Fetching the Bazel source code allows us to compile the Skylark linter
http_archive(
    name = "io_bazel",
    sha256 = "e373d2ae24955c1254c495c9c421c009d88966565c35e4e8444c082cb1f0f48f",
    strip_prefix = "bazel-968f87900dce45a7af749a965b72dbac51b176b3",
    url = "https://github.com/bazelbuild/bazel/archive/968f87900dce45a7af749a965b72dbac51b176b3.zip",
)

####################################
# We have a source dependency on the Devkit repository, because it's built with
# Bazel.
# This allows us to edit sources and have the effect appear immediately without
# re-packaging or "npm link"ing.
# Even better, things like aspects will visit the entire graph including
# ts_library rules in the devkit repository.
http_archive(
    name = "angular_devkit",
    sha256 = "8cf320ea58c321e103f39087376feea502f20eaf79c61a4fdb05c7286c8684fd",
    strip_prefix = "angular-cli-6.1.0-rc.0",
    url = "https://github.com/angular/angular-cli/archive/v6.1.0-rc.0.zip",
)

####################################
# Tell Bazel about some workspaces that were installed from npm.
local_repository(
    name = "angular",
    path = "node_modules/@angular/bazel",
)

local_repository(
    name = "rxjs",
    path = "node_modules/rxjs/src",
)

load("@angular//:index.bzl", "ng_setup_workspace")

ng_setup_workspace()

####################################
# Bazel will fetch its own dependencies from npm.
# This makes it easier for ngrx users who use Bazel.
yarn_install(
    name = "ngrx_compiletime_deps",
    package_json = "//tools:package.json",
    yarn_lock = "//tools:yarn.lock",
)
