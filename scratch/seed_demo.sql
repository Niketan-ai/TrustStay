-- Seed demo data for TrustStay
\set ON_ERROR_STOP on
-- Insert demo owner and capture id into variable owner_id
INSERT INTO users (phone_number, full_name, email, is_phone_verified, is_identity_verified)
VALUES ('1112223333','Demo Owner','demo-owner@truststay.test',false,false)
RETURNING id AS owner_id \gset;
-- Insert three demo properties using the captured owner_id
INSERT INTO properties (
    owner_id, title, description, property_type, target_tenant_type,
    gender_preference, rent_amount, deposit_amount,
    address_line1, city, state, postal_code,
    cctv_present, security_guard, biometric_access, curfew_time,
    verification_status
) VALUES
    (:owner_id,
     'Cozy Studio – Tech Park',
     'Small studio, high‑speed Wi‑Fi, close to metro. (demo)',
     'STUDIO','STUDENTS_ONLY','CO_ED',
     12000,20000,
     'Block A, 2nd Floor, Tech Park‑II','Bengaluru','Karnataka','560077',
     false,false,false,NULL,'UNVERIFIED'),
    (:owner_id,
     'Spacious 2‑BR Apartment – Lakeview',
     'Two‑bedroom apartment with balcony, near lake. (demo)',
     'APARTMENT','ANY','CO_ED',
     25000,30000,
     'Lakeview Residency, 3rd Floor, Sector 5','Pune','Maharashtra','411001',
     true,true,true,'10:00 PM','UNVERIFIED'),
    (:owner_id,
     'Modern PG – Green Campus',
     'Fully‑furnished PG with shared kitchen, 24‑hr security. (demo)',
     'PG_CO_LIVING','PROFESSIONALS_ONLY','FEMALE_ONLY',
     8000,12000,
     'Green Campus, Block C, Ground Floor','Hyderabad','Telangana','500032',
     false,true,false,NULL,'UNVERIFIED');
-- Verify inserts
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS property_count FROM properties;
