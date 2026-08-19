class CreateToolUsageRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :tool_usage_records do |t|
      t.references :user, foreign_key: true, null: true
      t.string :tool_slug, null: false
      t.string :ip_hash
      t.string :user_agent
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :tool_usage_records, :tool_slug
    add_index :tool_usage_records, :created_at
  end
end
