require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false

  # Render and other hosts can supply SECRET_KEY_BASE instead of a master key.
  config.require_master_key = ENV["RAILS_MASTER_KEY"].present? ||
    File.exist?(Rails.root.join("config/master.key"))

  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?

  force_ssl = ENV["RAILS_FORCE_SSL"] != "false"
  config.assume_ssl = force_ssl
  config.force_ssl = force_ssl
  config.ssl_options = {
    redirect: {
      exclude: ->(request) { request.path == "/api/v1/health" || request.path == "/up" }
    }
  }

  config.logger = ActiveSupport::Logger.new($stdout)
    .tap  { |logger| logger.formatter = Logger::Formatter.new }
    .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  config.log_tags = [:request_id]
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  config.i18n.fallbacks = true
  config.active_support.report_deprecations = false
  config.active_record.dump_schema_after_migration = false

  if ENV["RAILS_ALLOWED_HOSTS"].present?
    config.hosts = ENV["RAILS_ALLOWED_HOSTS"].split(",").map(&:strip)
  else
    config.hosts.clear
  end

  config.host_authorization = {
    exclude: ->(request) { request.path == "/api/v1/health" || request.path == "/up" }
  }
end
