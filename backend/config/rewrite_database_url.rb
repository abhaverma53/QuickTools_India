# Render Blueprint often injects an internal Postgres host without a domain
# (for example dpg-xxxxx-a). That name does not resolve from the web service,
# so expand it to the public Render hostname before Active Record connects.

return unless ENV["DATABASE_URL"].to_s.start_with?("postgres")

require "uri"

begin
  uri = URI.parse(ENV["DATABASE_URL"].sub(/\Apostgres:\/\//, "postgresql://"))
  if uri.host && !uri.host.include?(".")
    region = ENV["RENDER_POSTGRES_REGION"].to_s
    region = "singapore" if region.empty?
    uri.host = "#{uri.host}.#{region}-postgres.render.com"
  end

  params = URI.decode_www_form(uri.query.to_s)
  params << ["sslmode", "require"] unless params.any? { |key, _| key == "sslmode" }
  uri.query = URI.encode_www_form(params)

  ENV["DATABASE_URL"] = uri.to_s.sub(/\Apostgresql:\/\//, "postgres://")
rescue URI::InvalidURIError
  # Leave DATABASE_URL unchanged if it cannot be parsed.
end
