class ToolUsageRecord < ApplicationRecord
  belongs_to :user, optional: true

  validates :tool_slug, presence: true
end
