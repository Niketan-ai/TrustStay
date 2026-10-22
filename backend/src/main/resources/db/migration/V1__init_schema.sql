-- ==============================================================================
-- TrustStay V1 Initial Database Schema Migration
-- ==============================================================================

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Seed standard system roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_TENANT', 'Student or working professional seeking verified accommodation'),
    ('ROLE_OWNER', 'Property host or landlord offering accommodations'),
    ('ROLE_SAFETY_OFFICER', 'Security reviewer responsible for inspecting evidence and safety audits'),
    ('ROLE_ADMIN', 'Platform administrator with system moderation privileges')
ON CONFLICT (name) DO NOTHING;

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_identity_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. User roles mapping table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Properties table
CREATE TABLE IF NOT EXISTS properties (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    target_tenant_type VARCHAR(50) NOT NULL,
    gender_preference VARCHAR(30) NOT NULL,
    rent_amount NUMERIC(10, 2) NOT NULL,
    deposit_amount NUMERIC(10, 2) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    cctv_present BOOLEAN DEFAULT FALSE,
    security_guard BOOLEAN DEFAULT FALSE,
    biometric_access BOOLEAN DEFAULT FALSE,
    curfew_time VARCHAR(50),
    verification_status VARCHAR(30) DEFAULT 'UNVERIFIED',
    safety_score INT DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performant search filtering
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON properties(rent_amount);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_verification ON properties(verification_status);
