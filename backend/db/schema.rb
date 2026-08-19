# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source of truth for database schema in this repository.

ActiveRecord::Schema[7.1].define(version: 2026_08_19_120001) do
  enable_extension "plpgsql"

  create_table "tool_usage_records", force: :cascade do |t|
    t.bigint "user_id"
    t.string "tool_slug", null: false
    t.string "ip_hash"
    t.string "user_agent"
    t.jsonb "metadata", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_tool_usage_records_on_created_at"
    t.index ["tool_slug"], name: "index_tool_usage_records_on_tool_slug"
    t.index ["user_id"], name: "index_tool_usage_records_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "tool_usage_records", "users"
end
