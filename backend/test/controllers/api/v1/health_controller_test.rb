require "test_helper"

class Api::V1::HealthControllerTest < ActionDispatch::IntegrationTest
  test "health returns ok" do
    get "/api/v1/health"

    assert_response :success
    body = JSON.parse(response.body)
    assert_equal "ok", body["status"]
    assert_equal "QuickTools India", body["application"]
  end
end
