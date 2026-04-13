CREATE TYPE chat_plan_mode AS ENUM ('plan');

ALTER TABLE chats ADD COLUMN plan_mode chat_plan_mode;

-- Backfill: set plan_mode from the latest user-originated message or queued message
UPDATE chats c
SET plan_mode = 'plan'
WHERE EXISTS (
    SELECT 1
    FROM (
        SELECT cm.chat_id, cm.turn_mode
        FROM chat_messages cm
        WHERE cm.chat_id = c.id
            AND cm.role = 'user'
        ORDER BY cm.id DESC
        LIMIT 1
    ) latest_msg
    WHERE latest_msg.turn_mode = 'plan'
)
OR EXISTS (
    SELECT 1
    FROM chat_queued_messages cqm
    WHERE cqm.chat_id = c.id
        AND cqm.turn_mode = 'plan'
);
