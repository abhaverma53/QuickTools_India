require_relative "rewrite_database_url" if File.exist?(File.expand_path("rewrite_database_url.rb", __dir__))

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
