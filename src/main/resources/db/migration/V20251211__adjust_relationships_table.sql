ALTER TABLE relationships
    RENAME user_id TO requester_id;

ALTER TABLE relationships
    RENAME partner_id TO recipient_id;