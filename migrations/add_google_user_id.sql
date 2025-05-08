-- Add google_user_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_user_id VARCHAR(255) UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_google_user_id ON users(google_user_id); 