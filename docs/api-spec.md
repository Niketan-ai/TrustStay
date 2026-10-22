# TrustStay REST API Specification (v1)

Base URL: `http://localhost:8080/api/v1`

All responses follow a standard envelope format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-10-21T21:00:00Z"
}
```

---

## 1. System Health & Monitoring (`/health`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Lightweight health check. Returns `UP` without exposing secrets or connection parameters. |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "UP",
    "service": "TrustStay Backend REST API",
    "environment": "local"
  },
  "timestamp": "2026-10-21T21:20:00Z"
}
```

---

## 2. Accommodations & Properties (`/properties`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/properties` | Public | List all active verified accommodation listings. |
| `GET` | `/properties/search` | Public | Search properties with filters: `city`, `propertyType`, `maxRent`, `genderPreference`, `page`, `size`. |
| `GET` | `/properties/{id}` | Public | Detailed view of a single property listing. |
| `POST` | `/properties` | `OWNER` | Create a new accommodation listing (validated DTO). |

### Create Property Request Body (`POST /api/v1/properties`):
```json
{
  "title": "The Scholar Haven - Premium Student Studio",
  "description": "Quiet study suites 5 minutes walking distance from University Campus.",
  "propertyType": "STUDIO",
  "targetTenantType": "STUDENTS_ONLY",
  "genderPreference": "CO_ED",
  "rentAmount": 14500.00,
  "depositAmount": 25000.00,
  "addressLine1": "Near Christ University, Koramangala 4th Block",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postalCode": "560034",
  "cctvPresent": true,
  "securityGuard": true,
  "biometricAccess": true,
  "curfewTime": "10:30 PM",
  "ownerId": 1
}
```

### Validation Constraints:
* `title`: Not blank, between 5 and 200 characters.
* `description`: Not blank, between 10 and 3000 characters.
* `rentAmount`: Greater than 0.
* `depositAmount`: Non-negative.
* `city`, `state`, `postalCode`: Mandatory.
* `ownerId`: Mandatory.

---

## 3. Authentication & Identity (`/auth`) — Phase 4/5

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/request-otp` | Public | Send a 6-digit one-time password to the user's phone number. |
| `POST` | `/auth/verify-otp` | Public | Verify phone OTP and exchange for a signed JWT access + refresh token pair. |
| `POST` | `/auth/refresh-token` | Public | Obtain a new JWT access token using a valid refresh token. |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile, active roles, and verification status. |

---

## 4. Favorites & Scheduled Visits (`/favorites`, `/visits`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/favorites` | `TENANT` | List all saved properties for the logged-in tenant. |
| `POST` | `/favorites/{propertyId}` | `TENANT` | Bookmark a property. |
| `DELETE` | `/favorites/{propertyId}` | `TENANT` | Remove a property from bookmarks. |
| `POST` | `/visits` | `TENANT` | Request a physical or virtual property visit for a requested slot. |
| `GET` | `/visits/my` | Authenticated | View visit requests (tenant viewing their visits, or owner viewing requests). |
| `PATCH`| `/visits/{id}/status` | `OWNER` | Accept, decline, or suggest rescheduling for a visit request. |

---

## 5. Safety & Verification Workflow (`/verification`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/verification/requests` | `OWNER` | Submit property for official verification review. |
| `POST` | `/verification/requests/{id}/evidence` | `OWNER` | Upload evidence files (title deed, utility bills, video walkthrough). |
| `GET` | `/verification/queue` | `SAFETY_OFFICER` | Review the pending verification requests queue. |
| `POST` | `/verification/decisions` | `SAFETY_OFFICER` | Record an approval or rejection with detailed reasoning. |

---

## 6. Complaints, Fraud & Moderation (`/complaints`, `/moderation`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/complaints` | Authenticated | File a formal complaint against a property or user with categories and evidence. |
| `GET` | `/complaints` | `SAFETY_OFFICER`, `ADMIN` | Retrieve open complaints for triage and investigation. |
| `POST` | `/moderation/actions` | `ADMIN` | Issue a strike/warning, delist a property, or initiate suspension. |
| `GET` | `/suspensions/my` | Authenticated | Check active account or listing suspensions. |
| `POST` | `/appeals` | `OWNER` | Submit an appeal against an adverse moderation decision. |
