# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.6"

# sass-embedded's bundled Dart runtime crashes on Intel macOS 14 before
# compiling the theme. Chirpy 7.6 accepts converter 2.x; sassc is built by
# tools/bootstrap.sh with the pinned libc++ header fallback when required.
gem "jekyll-sass-converter", "2.2.0"

gem "html-proofer", "~> 5.0", group: :test

platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:windows]
