-- Fix users table structure
ALTER TABLE users MODIFY COLUMN id int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE users ADD UNIQUE INDEX idx_google_user_id (google_user_id);

-- Add any missing indexes
CREATE INDEX IF NOT EXISTS idx_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_role ON users(role); 