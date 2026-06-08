# InventIA

InventIA is a full-stack hackathon and team-formation platform built for the ENSAM Meknes Spring/React academic project.

## Stack

- Spring Boot 3.3, Java 17, Spring Security JWT, Spring Data JPA, MapStruct, MySQL
- React 18, Vite, React Router, Axios, Ant Design, Recharts
- Docker Compose, MinIO object storage, GitHub Actions, JaCoCo, Vitest, Playwright

## Run Locally

```bash
cp .env.example .env
docker compose up --build
```

Services:

| Service | URL | Credentials |
| --- | --- | --- |
| Frontend | http://localhost:5173 | App seed users below |
| Backend API | http://localhost:8080/api | JWT login |
| MinIO Console | http://localhost:9001 | inventia / inventia123 |
| MySQL | localhost:3306 | inventia / inventia |

Development:

```bash
cd backend && mvn spring-boot:run
cd frontend && npm install && npm run dev
```

Seed users:

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | admin@inventia.local | password |
| MANAGER | manager@inventia.local | password |
| USER | user@inventia.local | password |

Submission artifacts are uploaded by team leaders as `.zip` files and stored in the MinIO bucket `inventia-submissions`.

## Academic Context

- Module: Frameworks J2EE et Spring 2025/2026
- Filiere: ILSI 2eme Annee, Cycle Ingenieur
- Encadrant: Professeur S. Amri
- Institution: ENSAM Meknes
