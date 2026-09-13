#!/usr/bin/env bash
# Prepare the reproducible Ruby/Jekyll toolchain used by local tests.
set -euo pipefail

cd "$(dirname "$0")/.."

modern_ruby() {
  command -v ruby >/dev/null 2>&1 &&
    ruby -e 'require "rubygems"; exit(Gem::Version.new(RUBY_VERSION) >= Gem::Version.new("3.4") ? 0 : 1)' 2>/dev/null
}

if ! modern_ruby && command -v brew >/dev/null 2>&1; then
  brew_ruby=$(brew --prefix ruby@3.4 2>/dev/null || true)
  if [ -x "${brew_ruby}/bin/ruby" ]; then
    export PATH="${brew_ruby}/bin:${PATH}"
  fi
fi

if ! modern_ruby; then
  current=$(ruby -e 'print RUBY_VERSION' 2>/dev/null || echo "not found")
  echo "Ruby 3.4 is required (current: ${current})." >&2
  echo "On macOS install it with: brew install ruby@3.4" >&2
  exit 1
fi

bundle config set --local path vendor/bundle

# Some macOS Command Line Tools installations omit libc++ headers. Jekyll's
# eventmachine dependency still contains C++ code, so use pinned official LLVM
# headers as a local fallback. The archive and extracted files stay in ignored
# vendor/; only this bootstrap recipe is versioned.
if ! printf '#include <iostream>\nint main(){}\n' | "${CXX:-c++}" -x c++ -fsyntax-only - >/dev/null 2>&1; then
  libcxx_version="17.0.6"
  toolchain_dir="$(pwd)/vendor/toolchain"
  headers_dir="${toolchain_dir}/libcxx-${libcxx_version}.src/include"
  archive_url="https://github.com/llvm/llvm-project/releases/download/llvmorg-${libcxx_version}/libcxx-${libcxx_version}.src.tar.xz"
  expected_sha="edf7b12046ada95c63bd6c57099e8452f68f8be0affd9af96df16fd48e632ec1"

  if [ ! -f "${headers_dir}/iostream" ]; then
    temp_dir=$(mktemp -d "${TMPDIR:-/tmp}/site-libcxx.XXXXXX")
    trap 'rm -rf "$temp_dir"' EXIT
    curl --fail --location --silent --show-error "${archive_url}" -o "${temp_dir}/libcxx.tar.xz"
    actual_sha=$(shasum -a 256 "${temp_dir}/libcxx.tar.xz" | awk '{print $1}')
    if [ "${actual_sha}" != "${expected_sha}" ]; then
      echo "LLVM libc++ archive checksum mismatch." >&2
      exit 1
    fi
    tar -xf "${temp_dir}/libcxx.tar.xz" -C "${temp_dir}"
    mkdir -p "${toolchain_dir}"
    mv "${temp_dir}/libcxx-${libcxx_version}.src" "${toolchain_dir}/"
  fi

  cp tools/libcxx-config-site "${headers_dir}/__config_site"
  bundle config set --local build.eventmachine \
    "--with-cxxflags=-nostdinc++ --with-cppflags=-I${headers_dir}"
  bundle config set --local build.sassc \
    "--with-cxxflags=-nostdinc++ --with-cppflags=-I${headers_dir}"
else
  bundle config unset --local build.eventmachine >/dev/null 2>&1 || true
  bundle config unset --local build.sassc >/dev/null 2>&1 || true
fi

bundle install
