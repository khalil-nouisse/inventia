# InventIA

InventIA is a full-stack hackathon and team-formation platform built for the ENSAM Meknes Spring/React academic project.

## Stack

- Spring Boot 3.3, Java 17, Spring Security JWT, Spring Data JPA, MapStruct, MySQL
- React 18, Vite, React Router, Axios, Ant Design, Recharts
- Docker Compose, GitHub Actions, JaCoCo, Vitest, Playwright

## Run Locally

```bash
cp .env.example .env
docker compose up --build
```

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

## Academic Context

- Module: Frameworks J2EE et Spring 2025/2026
- Filiere: ILSI 2eme Annee, Cycle Ingenieur
- Encadrant: Professeur S. Amri
- Institution: ENSAM Meknes
