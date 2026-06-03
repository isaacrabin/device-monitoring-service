CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
    );

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert default admin user (skip if already exists)
INSERT INTO users (username, password, email, role, enabled)
VALUES (
           'admin',
           'admin123',
           'admin@example.com',
           'ADMIN',
           true
       ) ON CONFLICT (username) DO NOTHING;

-- Insert demo user (skip if already exists)
INSERT INTO users (username, password, email, role, enabled)
VALUES (
           'demo',
           'demo123',
           'demo@example.com',
           'USER',
           true
       ) ON CONFLICT (username) DO NOTHING;