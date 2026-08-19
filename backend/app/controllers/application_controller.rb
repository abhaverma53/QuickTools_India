class ApplicationController < ActionController::API
  unless Rails.env.local?
    rescue_from StandardError, with: :render_internal_error
  end

  private

  def render_internal_error(_exception)
    render json: { error: "Something went wrong. Please try again." }, status: :internal_server_error
  end
end
