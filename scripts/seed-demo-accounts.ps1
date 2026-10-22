# PowerShell script to seed demo accounts for TrustStay (idempotent, BCrypt password hashes via pgcrypto)

# Configuration - adjust only if your installation differs
$DbName = "truststay_db"
$DbUser = "postgres"
$Psql   = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Ensure the PostgreSQL password is supplied via the environment variable PGPASSWORD
if (-not $env:PGPASSWORD) {
    Write-Error "PGPASSWORD environment variable is not set. Set it before running this script."
    exit 1
}

# Build the SQL batch - single psql session with ON_ERROR_STOP=1 for full rollback
$Sql = @'
BEGIN;

-- Ensure pgcrypto extension is available (needed for BCrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin demo user (Niketan) - ROLE_ADMIN
INSERT INTO users (phone_number, full_name, email, password_hash,
                  is_phone_verified, is_identity_verified, status)
VALUES ('+000-000-0000', 'Niketan', 'niketan@truststay.demo',
        crypt('Admin123!', gen_salt('bf')),
        false, false, 'ACTIVE')
ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        password_hash = EXCLUDED.password_hash,
        is_phone_verified = EXCLUDED.is_phone_verified,
        is_identity_verified = EXCLUDED.is_identity_verified,
        status = EXCLUDED.status;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM   users u
JOIN   roles r ON r.name = 'ROLE_ADMIN'
WHERE  u.email = 'niketan@truststay.demo'
ON CONFLICT DO NOTHING;

-- Owner demo user - ROLE_OWNER
INSERT INTO users (phone_number, full_name, email, password_hash,
                  is_phone_verified, is_identity_verified, status)
VALUES ('+111-111-1111', 'Owner Demo', 'owner@truststay.demo',
        crypt('Owner123!', gen_salt('bf')),
        false, false, 'ACTIVE')
ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        password_hash = EXCLUDED.password_hash,
        is_phone_verified = EXCLUDED.is_phone_verified,
        is_identity_verified = EXCLUDED.is_identity_verified,
        status = EXCLUDED.status;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM   users u
JOIN   roles r ON r.name = 'ROLE_OWNER'
WHERE  u.email = 'owner@truststay.demo'
ON CONFLICT DO NOTHING;

-- Tenant demo user - ROLE_TENANT
INSERT INTO users (phone_number, full_name, email, password_hash,
                  is_phone_verified, is_identity_verified, status)
VALUES ('+222-222-2222', 'Tenant Demo', 'tenant@truststay.demo',
        crypt('Tenant123!', gen_salt('bf')),
        false, false, 'ACTIVE')
ON CONFLICT (email) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        phone_number = EXCLUDED.phone_number,
        password_hash = EXCLUDED.password_hash,
        is_phone_verified = EXCLUDED.is_phone_verified,
        is_identity_verified = EXCLUDED.is_identity_verified,
        status = EXCLUDED.status;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM   users u
JOIN   roles r ON r.name = 'ROLE_TENANT'
WHERE  u.email = 'tenant@truststay.demo'
ON CONFLICT DO NOTHING;

COMMIT;
'@

# Execute the batch - show any errors from psql
& "$Psql" -U $DbUser -d $DbName -v ON_ERROR_STOP=1 -c "$Sql"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Demo accounts seeded successfully (idempotent)."
} else {
    Write-Error "Seeding failed - see above for details."
}
