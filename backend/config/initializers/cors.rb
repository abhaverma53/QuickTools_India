# Frozen string literals are used project-wide via Rails defaults.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_URL", "http://localhost:5173")
      .split(",")
      .map { |origin| origin.strip.chomp("/") }
      .reject(&:blank?)

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      max_age: 600
  end
end
