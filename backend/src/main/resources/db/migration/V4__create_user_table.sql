-- Create users table for authentication
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
CREATE INDEX idx_users_username ON users(username);

-- Insert default admin user (password: admin123)
-- Password is BCrypt encoded: $2a$10$XURPShQ1sRqP7Vk7q3XU3OqXqXqXqXqXqXqXqXqXqXqXqXqXqXq
INSERT INTO users (id, username, password, email, role, enabled) VALUES
(
    uuid_generate_v4(),
    'admin',
    '$2a$10$NkM2JlqEeF/qQhU3VKKeMuGKqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
    'admin@example.com',
    'ADMIN',
    true
);

-- Insert demo user (password: demo123)
INSERT INTO users (id, username, password, email, role, enabled) VALUES
(
    uuid_generate_v4(),
    'demo',
    '$2a$10$XURPShQ1sRqP7Vk7q3XU3OqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
    'demo@example.com',
    'USER',
    true
);

-- Note: The actual BCrypt passwords are generated from:
-- Password: admin123 -> BCrypt hash
-- You'll need to generate proper BCrypt hashes