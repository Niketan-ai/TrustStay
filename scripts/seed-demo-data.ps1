# PowerShell seed script for TrustStay demo data
# -------------------------------------------------
# This script is **idempotent**: it will only insert records if they do not already exist.
# It runs **all SQL statements in a single psql session** with `ON_ERROR_STOP=1` so any error aborts the transaction.
# It expects the PostgreSQL password to be supplied via the environment variable `PGPASSWORD`
# (or via a .pgpass file). DO NOT run against production data.

# -------------------- Configuration --------------------
$DbName = "truststay_db"
$DbUser = "postgres"
# Use the PGPASSWORD env var – do not hard‑code credentials
if (-not $env:PGPASSWORD) {
    Write-Error "PGPASSWORD environment variable is not set. Set it before running this script."
    exit 1
}

# Path to psql executable (adjust if different)
$Psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Helper function to run a block of SQL in a single psql call
function Exec-BatchSql($sqlBlock) {
    & $Psql -U $DbUser -d $DbName -v ON_ERROR_STOP=1 -c "$sqlBlock"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "SQL batch execution failed."
        exit $LASTEXITCODE
    }
}

# 0️⃣ Fetch ROLE_OWNER id dynamically (do not assume it is 2)
$roleIdSql = "SELECT id FROM roles WHERE name = 'ROLE_OWNER';"
$ownerRoleId = & $Psql -U $DbUser -d $DbName -t -c $roleIdSql | ForEach-Object { $_.Trim() }
if (-not $ownerRoleId) {
    Write-Error "ROLE_OWNER not found in roles table."
    exit 1
}
Write-Host "ROLE_OWNER id resolved to: $ownerRoleId"

# -------------------- Begin Transaction (single session) --------------------
$batch = @"
BEGIN;

-- 1. Insert demo owner if not exists (phone 111-222-3333)
INSERT INTO users (phone_number, full_name, email, is_phone_verified, is_identity_verified)
SELECT '111-222-3333', 'Demo Owner', NULL, false, false
WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone_number = '111-222-3333')
RETURNING id;

-- Capture the owner id (whether inserted now or already existed)
WITH owner_cte AS (
    SELECT id FROM users WHERE phone_number = '111-222-3333'
)
SELECT id INTO TEMP TABLE demo_owner FROM owner_cte LIMIT 1;

-- 2. Ensure the owner has ROLE_OWNER
INSERT INTO user_roles (user_id, role_id)
SELECT (SELECT id FROM demo_owner), $ownerRoleId
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = (SELECT id FROM demo_owner) AND role_id = $ownerRoleId
);

-- 3. Insert three demo properties (using only valid enum values)
INSERT INTO properties (
    title, description, property_type, target_tenant_type, gender_preference,
    rent_amount, deposit_amount, address_line1, city, state, postal_code,
    cctv_present, security_guard, biometric_access, curfew_time,
    verification_status, safety_score, is_active, owner_id
) VALUES
    ('Demo Studio (DEMO – UNVERIFIED)', 'Demo Studio – UNVERIFIED – perfect for students.', 'STUDIO', 'ANY', 'CO_ED', 500, 1000, '123 Demo St', 'Demo City', 'Demo State', '00000', false, false, false, NULL, 'UNVERIFIED', NULL, true, (SELECT id FROM demo_owner)),
    ('Demo Apartment (DEMO – UNVERIFIED)', 'Demo Apartment – UNVERIFIED – spacious living area.', 'APARTMENT', 'ANY', 'CO_ED', 800, 1500, '456 Sample Ave', 'Demo City', 'Demo State', '00000', false, false, false, NULL, 'UNVERIFIED', NULL, true, (SELECT id FROM demo_owner)),
    ('Demo Hostel (DEMO – UNVERIFIED)', 'Demo Hostel – UNUNVERIFIED – shared facilities.', 'HOSTEL', 'ANY', 'CO_ED', 300, 500, '789 Example Blvd', 'Demo City', 'Demo State', '00000', false, false, false, NULL, 'UNVERIFIED', NULL, true, (SELECT id FROM demo_owner))
ON CONFLICT DO NOTHING; -- Prevent duplicate inserts based on unique title+owner (if a unique constraint exists)

COMMIT;
"@

Exec-BatchSql $batch
Write-Host "Demo data seeding completed successfully."

# -------------------------------------------------
# This script is idempotent: it will only insert records if they do not already exist.
# It expects the PostgreSQL password to be supplied via the environment variable PGPASSWORD
# (or via a .pgpass file). DO NOT run against production data.

# -------------------- Configuration --------------------
$DbName = "truststay_db"
$DbUser = "postgres"
# Use the PGPASSWORD env var – do not hard‑code credentials
if (-not $env:PGPASSWORD) {
    Write-Error "PGPASSWORD environment variable is not set. Set it before running this script."
    exit 1
}

# Path to psql executable (adjust if different)
$Psql = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Helper function to run a SQL command safely
function Exec-Sql($sql) {
    & $Psql -U $DbUser -d $DbName -v ON_ERROR_STOP=1 -c $sql
    if ($LASTEXITCODE -ne 0) {
        Write-Error "SQL execution failed: $sql"
        exit $LASTEXITCODE
    }
}

# -------------------- Begin Transaction --------------------
Exec-Sql "BEGIN;"

# 1. Insert demo owner if not exists (phone 111-222-3333)
$ownerPhone = '111-222-3333'
$ownerFullName = 'Demo Owner'
$ownerEmail = NULL  # optional, can be NULL

# Insert and capture generated id using WITH ... INSERT ... RETURNING
$ownerInsertSql = @"
WITH ins AS (
    INSERT INTO users (phone_number, full_name, email, is_phone_verified, is_identity_verified)
    SELECT '$ownerPhone', '$ownerFullName', $ownerEmail, false, false
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE phone_number = '$ownerPhone')
    RETURNING id
)
SELECT id FROM ins UNION ALL SELECT id FROM users WHERE phone_number = '$ownerPhone';
"@
$ownerId = & $Psql -U $DbUser -d $DbName -t -c $ownerInsertSql | ForEach-Object { $_.Trim() }
Write-Host "Demo owner id: $ownerId"

# 2. Ensure the owner has ROLE_OWNER (role_id = 2)
Exec-Sql "INSERT INTO user_roles (user_id, role_id) SELECT $ownerId, 2 WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = $ownerId AND role_id = 2);"

# 3. Insert three demo properties – each checks for existing title+owner to avoid duplicates
$properties = @(
    @{ Title = 'Demo Studio (DEMO – UNVERIFIED)'; Type = 'STUDIO'; City = 'Demo City'; Address = '123 Demo St, Demo City'; Rent = 500; Deposit = 1000; Description = 'Demo Studio – UNVERIFIED – perfect for students.' },
    @{ Title = 'Demo Apartment (DEMO – UNVERIFIED)'; Type = 'APARTMENT'; City = 'Demo City'; Address = '456 Sample Ave, Demo City'; Rent = 800; Deposit = 1500; Description = 'Demo Apartment – UNVERIFIED – spacious living area.' },
    @{ Title = 'Demo Hostel (DEMO – UNVERIFIED)'; Type = 'HOSTEL'; City = 'Demo City'; Address = '789 Example Blvd, Demo City'; Rent = 300; Deposit = 500; Description = 'Demo Hostel – UNVERIFIED – shared facilities.' }
)

foreach ($p in $properties) {
    $title = $p.Title
    $type = $p.Type
    $city = $p.City
    $address = $p.Address
    $rent = $p.Rent
    $deposit = $p.Deposit
    $desc = $p.Description

    $insertPropSql = @"
INSERT INTO properties (title, description, property_type, target_tenant_type, gender_preference,
    rent_amount, deposit_amount, address_line1, city, state, postal_code,
    cctv_present, security_guard, biometric_access, curfew_time, verification_status, safety_score,
    is_active, owner_id)
SELECT '$title', '$desc', '$type', 'OPEN', 'COED', $rent, $deposit,
    '$address', '$city', 'State', '00000',
    false, false, false, NULL, 'UNVERIFIED', NULL,
    true, $ownerId
WHERE NOT EXISTS (SELECT 1 FROM properties WHERE title = '$title' AND owner_id = $ownerId);
"@
    Exec-Sql $insertPropSql
    Write-Host "Inserted/checked property: $title"
}

# Commit transaction
Exec-Sql "COMMIT;"
Write-Host "Demo data seeding completed successfully."
