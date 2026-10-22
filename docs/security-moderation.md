# TrustStay Security & Moderation Framework

TrustStay is built with a "safety-first" philosophy. The security architecture guarantees user privacy, prevents unauthorized account access, and provides transparent recourse through human-in-the-loop moderation.

---

## 1. Authentication & Phone OTP Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Owner
    participant Client as React + Vite Client
    participant Backend as Spring Boot API
    participant SMS as SMS OTP Gateway
    participant DB as PostgreSQL 18

    User->>Client: Enter Phone Number (+91-XXXXX-XXXXX)
    Client->>Backend: POST /api/v1/auth/request-otp
    Backend->>Backend: Rate-limit check (Max 3 OTPs / 10 mins)
    Backend->>Backend: Generate cryptographically secure 6-digit OTP
    Backend->>DB: Store hashed OTP with 5-minute TTL
    Backend->>SMS: Dispatch SMS
    Backend-->>Client: 200 OK (OTP Sent)
    
    User->>Client: Enters 6-digit OTP
    Client->>Backend: POST /api/v1/auth/verify-otp
    Backend->>DB: Validate hash and expiration
    Backend->>Backend: Mint JWT Access Token (15 min) + Refresh Token (7 days)
    Backend-->>Client: HTTP-Only Cookie (Refresh) + JSON Payload (Access Token + User Roles)
```

### Key Security Safeguards
* **No Hardcoded Secrets**: Secrets such as `JWT_SECRET`, database passwords, and SMS API keys are retrieved from environment variables.
* **OTP Brute-Force Defense**: Failed attempts are capped at 5 consecutive tries before a mandatory 30-minute lockout.
* **Secure Token Storage**: Refresh tokens are issued inside strict `HttpOnly`, `SameSite=Strict`, `Secure` cookies to protect against XSS (Cross-Site Scripting).

---

## 2. Role-Based Access Control (RBAC)

TrustStay organizes platform roles with clear authorization boundaries:

| Role | Key Capabilities |
| :--- | :--- |
| **`ROLE_TENANT`** | Browse verified properties, filter by safety tags, save favorites, submit visit requests, report listings/complaints. |
| **`ROLE_OWNER`** | Create and manage accommodation listings, submit verification documents, manage visit requests, file appeals. |
| **`ROLE_SAFETY_OFFICER`** | Review verification evidence queues, approve/reject property trust badges, investigate tenant safety complaints. |
| **`ROLE_ADMIN`** | Execute platform-wide moderation actions (suspensions, permanent bans), configure system parameters, audit all logs. |

---

## 3. Moderation & Suspension Lifecycle

```mermaid
flowchart TD
    Complaint[Tenant Complaint or AI Fraud Finding] --> Triage[Safety Officer Triage]
    Triage --> Investigation[Evidence Review & Contact Parties]
    Investigation --> Decision{Action Required?}
    Decision -->|No| Dismiss[Dismiss & Close Ticket]
    Decision -->|Minor| Warning[Issue Owner Warning / Strike]
    Decision -->|Severe| Suspend[Issue Listing / Account Suspension]
    Suspend --> Appeal{Owner Submits Appeal within 14 Days?}
    Appeal -->|Yes| SeniorReview[Independent Senior Officer Review]
    Appeal -->|No| Permanence[Suspension Upheld / Permanent Ban]
    SeniorReview -->|Appeal Valid| Reinstated[Reinstate Account & Clear Record]
    SeniorReview -->|Appeal Denied| Permanence
```

---

## 4. Immutable Audit Logging

Every critical event is written to the `audit_logs` table:
* Who performed the action (`actor_id`, IP address, user-agent).
* What was modified (`entity_name`, `entity_id`).
* Exact payload changes (`before` and `after` state in JSONB).
* Timestamps generated securely by the database (`CURRENT_TIMESTAMP`).
