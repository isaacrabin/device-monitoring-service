CREATE TABLE status_report (
                               id BIGSERIAL PRIMARY KEY,
                               device_id UUID NOT NULL REFERENCES device(id) ON DELETE CASCADE,
                               reported_at TIMESTAMPTZ NOT NULL,
                               status VARCHAR(20) NOT NULL,
                               diagnostic_message TEXT,
                               created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_report_device_time ON status_report(device_id, reported_at DESC);
CREATE INDEX idx_status_report_reported_at ON status_report(reported_at);
