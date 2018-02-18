# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(name = "ngrx")


####################################
# The Bazel buildtools repo contains tools like the BUILD file formatter, buildifier
http_archive(
    name = "com_github_bazelbuild_buildtools",
    # Note, this commit matches the version of buildifier in angular/ngcontainer
    url = "https://github.com/bazelbuild/buildtools/archive/b3b620e8bcff18ed3378cd3f35ebeb7016d71f71.zip",
    strip_prefix = "buildtools-b3b620e8bcff18ed3378cd3f35ebeb7016d71f71",
    sha256 = "dad19224258ed67cbdbae9b7befb785c3b966e5a33b04b3ce58ddb7824b97d73",
)


####################################
# Fetch and install the NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    url = "https://github.com/bazelbuild/rules_nodejs/archive/0.4.1.zip",
    strip_prefix = "rules_nodejs-0.4.1",
    sha256 = "e9bc013417272b17f302dc169ad597f05561bb277451f010043f4da493417607",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories", "yarn_install")

node_repositories(package_json = ["//:package.json"])


####################################
# Fetch and install the TypeScript rules
git_repository(
    name = "build_bazel_rules_typescript",
    remote = "git@github.com:alexeagle/rules_typescript.git",
    commit = "623565514d6bad77d9310f2658bf8457eb4979bb",
)

load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()

# Some of the TypeScript is written in Go.
# Bazel doesn't support transitive WORKSPACE deps, so we must repeat them here.
http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.9.0/rules_go-0.9.0.tar.gz",
    sha256 = "4d8d6244320dd751590f9100cf39fd7a4b75cd901e1f3ffdfd6f048328883695",
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

git_repository(
    name = "angular_devkit",
    remote = "git@github.com:alexeagle/devkit.git",
    commit = "2a2bcb7650394fd4d6c5c999e744b9fbf78e5719",
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
