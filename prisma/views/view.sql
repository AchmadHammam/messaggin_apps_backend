CREATE OR REPLACE VIEW "chat_user_view" AS 
    SELECT
        cm.id, 
        cm.chat_personal_room_id, 
        cm.sender_id,
        sender.nama AS sender_name,
        receiver.id AS receiver_id,
        receiver.nama AS receiver_name,
        cm.message,
        cm.is_read,
        cm.created_at,
        cm.updated_at
    FROM chat_message cm 
    JOIN users sender ON cm.sender_id = sender.id
    JOIN chat_personal_room cpr ON cm.chat_personal_room_id = cpr.id
    JOIN users receiver 
    
        ON (CASE 
            WHEN cm.sender_id = cpr.user1_id THEN cpr.user2_id 
            ELSE cpr.user1_id 
            END) = receiver."id";