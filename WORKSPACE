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
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.6.0.zip",
    strip_prefix = "rules_nodejs-0.6.0",
    sha256 = "e8a2bb5ca51fbafb244bc507bcebcae33a63d969f47413b319a8dcce032845bf",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

check_bazel_version("0.9.0")
node_repositories(package_json = ["//:package.json"])

####################################
# Fetch and install the TypeScript rules
http_archive(
    name = "build_bazel_rules_typescript",
    url = "https://github.com/bazelbuild/rules_typescript/archive/0.11.1.zip",
    strip_prefix = "rules_typescript-0.11.1",
    sha256 = "7406bea7954e1c906f075115dfa176551a881119f6820b126ea1eacb09f34a1a",
)

load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()

####################################
# The Bazel buildtools repo contains tools like the BUILD file formatter, buildifier
# This commit matches the version of buildifier in angular/ngcontainer
# If you change this, also check if it matches the version in the angular/ngcontainer
# version in /.circleci/config.yml
BAZEL_BUILDTOOLS_VERSION = "b3b620e8bcff18ed3378cd3f35ebeb7016d71f71"

http_archive(
    name = "com_github_bazelbuild_buildtools",
    url = "https://github.com/bazelbuild/buildtools/archive/%s.zip" % BAZEL_BUILDTOOLS_VERSION,
    strip_prefix = "buildtools-%s" % BAZEL_BUILDTOOLS_VERSION,
    sha256 = "dad19224258ed67cbdbae9b7befb785c3b966e5a33b04b3ce58ddb7824b97d73",
)

http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.7.1/rules_go-0.7.1.tar.gz",
    sha256 = "341d5eacef704415386974bc82a1783a8b7ffbff2ab6ba02375e1ca20d9b031c",
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()

go_register_toolchains()


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

####################################
# Bazel will fetch its own dependencies from npm.
# This makes it easier for ngrx users who use Bazel.
yarn_install(
    name = "ngrx_compiletime_deps",
    package_json = "//tools:package.json",
    yarn_lock = "//tools:yarn.lock",
)
