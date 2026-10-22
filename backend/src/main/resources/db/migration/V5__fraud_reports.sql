CREATE TABLE IF NOT EXISTS fraud_reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    report_category VARCHAR(50) NOT NULL,
    reported_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    reported_property_id BIGINT REFERENCES properties(id) ON DELETE SET NULL,
    reported_booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    evidence_reference VARCHAR(500),
    severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'REPORTED',
    assigned_reviewer_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    resolution_reason TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_reporter ON fraud_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_fraud_reports_category ON fraud_reports(report_category);
