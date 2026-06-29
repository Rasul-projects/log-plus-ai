# log-plus-ai
Built on a rock-solid data foundation using AWS DynamoDB, it handles high-throughput stream ingestion with ease, while the Vercel v0-designed frontend guarantees lightning-fast user response times during critical system outages
# LogPulse AI

LogPulse AI is a real-time, B2B log monitoring and automated anomaly diagnosis platform built for DevOps teams. Instead of spending hours digging through text-heavy cloud logs during an active production incident, LogPulse AI structures, categorizes, and uses AI to instantly diagnose log errors, providing a root-cause analysis and actionable fix recommendations in seconds. Built on a rock-solid data foundation using AWS DynamoDB, it handles high-throughput stream ingestion with ease, while the Vercel v0-designed frontend guarantees lightning-fast user response times during critical system outages.

## 🚀 Stack Architecture

- **Frontend UI:** Next.js (App Router) scaffolded with Vercel v0, optimized for fast rendering and real-time streaming updates.
- **Hosting & Deployment:** Deployed seamlessly on the Vercel platform.
- **Backend Infrastructure:** Next.js Secure Serverless API Routes.
- **Database Layer:** AWS DynamoDB (Serverless NoSQL) utilizing a high-performance single-table design pattern to manage rapid ingestion streams with sub-millisecond latencies.

## 🛠️ Data Model (AWS DynamoDB)

The application implements an optimized Single-Table Design pattern within a single DynamoDB table (`LogPulse_Master_Store`):

- **Partition Key (PK):** `ORG#<OrganizationID>` (e.g., `ORG#1234`)
- **Sort Key (SK):** `LOG#<Timestamp>#<LogID>` (e.g., `LOG#2026-06-29T16:00:00Z#abc-987`)

### Sample Ingested Schema Structure:
```json
{
  "PK": "ORG#1234",
  "SK": "LOG#2026-06-29T16:07:00Z#log_8831",
  "service": "Authentication-API",
  "logLevel": "CRITICAL",
  "errorCode": "ERR_DB_CONN_TIMEOUT",
  "rawMessage": "Connection timeout after 5000ms matching pool max lines.",
  "aiDiagnosis": "The database connection pool is exhausted. Recommendation: Scale up the Aurora read-replica or optimize connections in serverless functions.",
  "status": "UNRESOLVED"
}
