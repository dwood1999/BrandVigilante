-- Update users table schema
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS google_user_id VARCHAR(255) UNIQUE,
    MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT,
    MODIFY COLUMN email VARCHAR(255) NOT NULL UNIQUE,
    MODIFY COLUMN password VARCHAR(255) NOT NULL,
    MODIFY COLUMN phone VARCHAR(20) NULL,
    MODIFY COLUMN role ENUM('user', 'admin', 'lead') DEFAULT 'user';

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_google_user_id ON users(google_user_id);
CREATE INDEX IF NOT EXISTS idx_role ON users(role); 