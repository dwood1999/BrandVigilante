-- Drop columns not used by Lucia v3 adapter
ALTER TABLE user_session
DROP COLUMN IF EXISTS active_expires,
DROP COLUMN IF EXISTS idle_expires,
DROP COLUMN IF EXISTS created_at; -- created_at is also not standard for Lucia v3 session table

-- Modify id to be VARCHAR(255) if it's not already (it was VARCHAR(15))
ALTER TABLE user_session
MODIFY COLUMN id VARCHAR(255) PRIMARY KEY;

-- Ensure user_id and expires_at are correctly defined (they seem okay from DESCRIBE)
-- ALTER TABLE user_session MODIFY COLUMN user_id INT NOT NULL; (already int(11) NOT NULL)
-- ALTER TABLE user_session MODIFY COLUMN expires_at DATETIME NOT NULL; (already datetime NOT NULL)

-- Add foreign key constraint if it doesn't exist or was dropped
-- First, drop if it exists to avoid error during re-creation (name might be unknown)
-- SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
-- WHERE TABLE_SCHEMA = 'dwood_db' AND TABLE_NAME = 'user_session' AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME = 'users';
-- If a name is found, use: ALTER TABLE user_session DROP FOREIGN KEY <constraint_name>;
-- For simplicity, we'll assume it might need to be added or re-added.
-- This might fail if a constraint with a different name but same definition exists.
ALTER TABLE user_session
ADD CONSTRAINT fk_user_session_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE; 