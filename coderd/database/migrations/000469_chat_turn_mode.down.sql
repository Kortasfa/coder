ALTER TABLE chats DROP COLUMN plan_mode;
DROP TYPE chat_plan_mode;

ALTER TABLE chat_messages DROP COLUMN turn_mode;
ALTER TABLE chat_queued_messages DROP COLUMN turn_mode;
DROP TYPE chat_turn_mode;
