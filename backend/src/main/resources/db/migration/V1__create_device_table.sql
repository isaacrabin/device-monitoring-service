CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE device (
                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        name VARCHAR(255) NOT NULL,
                        device_type VARCHAR(50) NOT NULL,
                        hostname VARCHAR(255),
                        ip_address VARCHAR(255),
                        location VARCHAR(255),
                        registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        last_status VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN',
                        last_report_timestamp TIMESTAMPTZ,
                        last_diagnostic_message TEXT,
                        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_last_report ON device(last_report_timestamp);
CREATE INDEX idx_device_type ON device(device_type);