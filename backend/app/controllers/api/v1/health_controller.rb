module Api
  module V1
    class HealthController < ApplicationController
      def show
        render json: {
          status: "ok",
          application: "QuickTools India"
        }
      end
    end
  end
end
