CREATE TYPE chat_turn_mode AS ENUM ('plan');
ALTER TABLE chat_messages ADD COLUMN turn_mode chat_turn_mode;
ALTER TABLE chat_queued_messages ADD COLUMN turn_mode chat_turn_mode;
