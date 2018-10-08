# The WORKSPACE file tells Bazel that this directory is a "workspace", which is like a project root.
# The content of this file specifies all the external dependencies Bazel needs to perform a build.

####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(name = "ngrx")

# Load NodeJS rules. Note that this is technically not needed because
# `rules_typescript_dependencies()` would also load the NodeJS rules, but we specifically need
# at least v0.14.1 which includes: https://github.com/bazelbuild/rules_nodejs/pull/341
http_archive(
  name = "build_bazel_rules_nodejs",
  url = "https://github.com/bazelbuild/rules_nodejs/archive/0.14.1.zip",
  strip_prefix = "rules_nodejs-0.14.1",
  sha256 = "813eb51733d3632f456f3bb581d940ed64e80dab417595c93bf5ad19079898e2"
)

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories", "yarn_install")

check_bazel_version("0.15.0")

# Add TypeScript rules
http_archive(
  name = "build_bazel_rules_typescript",
  url = "https://github.com/bazelbuild/rules_typescript/archive/0.18.0.zip",
  strip_prefix = "rules_typescript-0.18.0",
  sha256 = "4726e07a2f8d23b5e3af166f3b2a6e8aa75adad94b35ab4d959e8fe875f90272",
)

# Fetch transient dependencies of the TypeScript bazel rules.
load("@build_bazel_rules_typescript//:package.bzl", "rules_typescript_dependencies")
rules_typescript_dependencies()

# NOTE: this rule installs nodejs, npm, and yarn, but does NOT install
# your npm dependencies. You must still run the package manager.
load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories", "yarn_install")

node_repositories(
  # For deterministic builds, specify explicit NodeJS and Yarn versions. Keep the Yarn version
  # in sync with the version of Travis.
  node_version = "10.10.0",
  yarn_version = "1.9.4",
)



# Use Bazel managed node modules. See more below:
# https://github.com/bazelbuild/rules_nodejs#bazel-managed-vs-self-managed-dependencies
yarn_install(
  name = "npm",
  package_json = "//:package.json",
  yarn_lock = "//:yarn.lock",
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

# Setup TypeScript Bazel workspace
load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")
ts_setup_workspace()

# Add Angular rules
local_repository(
  name = "angular",
  path = "node_modules/@angular/bazel",
)

# Add rxjs
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
