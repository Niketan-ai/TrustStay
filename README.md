# TrustStay

## Quick Start (Local Demo)

### Prerequisites
- **Node.js** (v20+) and **npm**
- **Java 25** (JDK) with Maven Wrapper (`mvnw`)
- **PostgreSQL 18** running locally (default port 5432)
- Set the database password in the environment variable `PGPASSWORD` (or configure a `.pgpass` file) so that `psql` can connect without prompting.

### Backend
```bash
# From the project root
cd backend
./mvnw clean package -DskipTests   # builds the JAR
./mvnw spring-boot:run            # starts the API on http://localhost:8080
```
Verify it works:
```bash
curl http://localhost:8080/api/v1/health
```
You should see a JSON payload with `success: true`.

### Seed Demo Data (idempotent)
```bash
# From the project root – the script will create a demo owner and three demo listings.
# **Do NOT** run this against a production database.
cd scripts
powershell -ExecutionPolicy Bypass -File ./seed-demo-data.ps1
```
The script:
1. Inserts a demo owner (`phone_number = 111-222-3333`, `full_name = Demo Owner`) **only if it does not already exist**.
2. Links that user to the existing `ROLE_OWNER` (role_id = 2).
3. Inserts three property rows marked with `(DEMO – UNVERIFIED)` in their description and with `verification_status = 'UNVERIFIED'`. Each insert checks for existing rows with the same title and owner to avoid duplicates.
4. Runs within a single transaction and aborts on any error (`ON_ERROR_STOP=1`).

After seeding, you can verify:
```bash
curl http://localhost:8080/api/v1/properties
```
You should receive a `data` array containing three demo listings.

### Frontend
```bash
cd frontend
npm install
npm run dev   # Vite dev server at http://localhost:5173
```
The app will automatically call `GET /api/v1/properties` and display the demo catalog. The UI shows a **Backend Status** badge indicating connection health.

### Running Tests
```bash
# Backend (skip tests for speed, but you can run them)
cd backend
./mvnw test

# Frontend
cd frontend
npm test   # all tests currently pass
```

---

*All demo data is clearly labelled as UNVERIFIED and does **not** create real user credentials. Use only for local development.*

**TrustStay** is a safety-first accommodation rental platform tailored for students and working professionals. It combines verified listings, strict safety parameters (CCTV, curfew policies, security guards, gender-friendly accommodations), a secure phone OTP authentication system, and an auditable moderation pipeline.

---

## Project Structure

```text
TrustStay/
├── docs/                     # Architecture, schema, API, and safety documentation
│   ├── architecture.md       # System architecture and stack breakdown
│   ├── database-schema.md    # 16 entities, ER diagrams, Flyway migration plan
│   ├── api-spec.md           # REST API endpoints (v1)
│   └── security-moderation.md# Phone OTP, RBAC, moderation, audit logging
├── frontend/                 # React 19 + TypeScript + Vite SPA
├── backend/                  # Java Spring Boot 3.4+ REST API (Java 25 LTS)
├── fraud-service/            # Optional Python FastAPI fraud detection microservice
├── infrastructure/           # Local environment configurations and Docker templates
└── .gitignore                # Protects secrets, node_modules, and build targets
```

---

## Development Roadmap & Phases

- **Phase 1: Environment Inspection & Configuration** (Complete)
  - Verified Node.js, npm, Java 25 JDK, Git.
  - Installed and verified PostgreSQL 18.6 service.
  - Configured `JAVA_HOME` and PostgreSQL `PATH`.

- **Phase 2: Project Architecture & Initial Structure** (Current)
  - Created initial directory layout and `.gitignore`.
  - Detailed design for 16 core entities, relationships, and ERD.
  - Specified v1 REST API contract and safety/moderation workflows.

- **Phase 3: Frontend Implementation (React + TypeScript + Vite)** (Next)
  - Initialize Vite + React + TypeScript in `frontend/`.
  - Safety-first UI design system, property catalog, and role dashboards.

- **Phase 4: Backend Implementation (Spring Boot + PostgreSQL + Flyway)**
  - Initialize Spring Boot project with Maven Wrapper (`mvnw`).
  - Flyway migration scripts (`V1__init_schema.sql`).
  - Spring Security with Phone OTP authentication and RBAC.

- **Phase 5: Safety, Moderation & Optional Fraud Integration**
  - Verification workflow, evidence handling, and appeals.
  - Python FastAPI fraud scoring service integration.
