# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.6"

# sass-embedded's bundled Dart runtime crashes on this Intel macOS host.
# The stable LibSass converter remains compatible with Chirpy 7.6 and Jekyll 4.
gem "jekyll-sass-converter", "~> 2.2"

gem "html-proofer", "~> 5.0", group: :test

platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:windows]
