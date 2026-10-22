# TrustStay Architecture & System Design

TrustStay is a safety-first accommodation rental platform designed specifically for students and working professionals. It bridges the trust gap between property owners and tenants through multi-step identity verification, physical and document validation, fraud detection, and transparent safety reporting.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer"]
        WebClient["React 19 + TypeScript + Vite SPA<br/>(Tailwind CSS / Responsive Web)"]
    end

    subgraph APILayer["Backend API Gateway & Core Service"]
        SpringBoot["Java Spring Boot 3.4+ REST API<br/>(Java 25 LTS Runtime)<br/>- Spring Security + Phone OTP JWT<br/>- Spring Data JPA<br/>- Flyway Migration Engine"]
    end

    subgraph DataLayer["Persistence Layer"]
        Postgres["PostgreSQL 18 Database<br/>- Schema Versioned via Flyway<br/>- Multi-tenant / Role Secured Data"]
    end

    subgraph MicroserviceLayer["Optional Analytics & Fraud Service"]
        FastAPI["Python FastAPI 3.13 Microservice<br/>- Listing Duplicate Detection<br/>- Image & Text Anomaly Scoring<br/>- Risk Assessment Engine"]
    end

    WebClient -->|HTTPS / JSON REST API| SpringBoot
    SpringBoot -->|JDBC / Connection Pool (HikariCP)| Postgres
    SpringBoot -.->|Async HTTP / WebClient| FastAPI
```

---

## 2. Technology Stack Selection & Compatibility Matrix

| Tier | Technology | Version | Compatibility & Verification Note |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + TypeScript + Vite | React 19, TS 5.x, Vite 6.x | Compatible with installed Node.js 24 and npm 11. |
| **Backend** | Java Spring Boot REST API | Spring Boot 3.4.x / 3.5.x | Fully verified with installed Java 25.0.4 LTS. |
| **Database** | PostgreSQL | PostgreSQL 18.6 | Active local service on port 5432. |
| **Migrations**| Flyway | Flyway 10.x / 11.x | Managed natively inside Spring Boot starter. |
| **Fraud Service** | Python FastAPI | FastAPI + Uvicorn | Compatible with installed Python 3.13.7. |
| **Build Tool**| Maven Wrapper (`mvnw`) | Maven 3.9+ runtime | Self-contained within backend directory. |

---

## 3. Core Safety & Trust Principles

1. **Verified Owners & Listings**: Every property listing undergoes physical/digital verification before receiving the "TrustStay Certified" badge.
2. **Role-Based Access Control (RBAC)**: Strict separation between `TENANT`, `OWNER`, `SAFETY_OFFICER`, and `ADMIN`.
3. **Audited Actions**: Critical actions (verification decisions, suspensions, listing edits) are permanently recorded in an immutable `AuditLog`.
4. **Secure Secret Management**: Database credentials, JWT secrets, and SMS OTP gateway API keys are stored in environment variables, never hardcoded.
