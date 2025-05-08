CREATE TABLE IF NOT EXISTS user_session (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- If the table already exists, ensure expires_at is present
ALTER TABLE user_session
ADD COLUMN IF NOT EXISTS expires_at DATETIME NOT NULL;

-- Drop the old auth_user table if it exists, as Lucia v3 uses your main users table
-- The adapter configuration specifies `user: "auth_user"`, which is a bit misleading.
-- It should be the name of your *actual* users table if you want Lucia to manage user attributes directly through the adapter.
-- However, Lucia v3 typically uses the main users table (e.g., `users`) and the adapter is primarily for session management.
-- Let's assume `users` is the main user table and `auth_user` might be a remnant or misconfiguration.
-- For now, we'll focus on fixing `user_session`.

-- We should also ensure your main `users` table (which seems to be `users` based on UserModel)
-- has an `id` column that `user_session.user_id` can reference.
-- From previous logs, the `users` table has `id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`.

-- Verify `auth_user` table (if it exists, what is its purpose?)
-- If `auth_user` is intended to be the primary user table for Lucia, its schema needs to be correct.
-- If `users` is the primary table, then the `user: "auth_user"` in the adapter might need to be `user: "users"`
-- OR, if you don't want Lucia to manage user attributes through the adapter (you handle it via UserModel),
-- then `auth_user` might not be strictly needed by the adapter for basic session management linked to `users.id`.

-- For now, let's just create/fix `user_session`. 