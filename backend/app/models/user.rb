class User < ApplicationRecord
  has_many :tool_usage_records, dependent: :nullify

  validates :email, uniqueness: true, allow_nil: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
end
