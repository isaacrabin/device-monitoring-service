# Device Monitoring Service

A full-stack real-time network device monitoring application built with Spring Boot (backend) and React - Next.js (frontend), containerized with Docker.

---

## Prerequisites

Make sure you have the following installed before proceeding:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)

That's it. You do **not** need Java, Maven, or Node.js installed locally.

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/isaacrabin/device-monitoring-service.git
cd device-monitoring-service
```

### 2. Build and start all services

```bash
docker compose up --build
```

This single command will:

- Pull the PostgreSQL 15 image
- Build the Spring Boot backend JAR
- Build the Next.js frontend
- Start all three services in the correct order (postgres → backend → frontend)

> First build takes 3–5 minutes as Maven and npm dependencies are downloaded and cached.

### 3. Access the application

| Service  | URL                         |
|----------|-----------------------------|
| Frontend | http://localhost:3000        |
| Backend API | http://localhost:8080/api |
| API Health | http://localhost:8080/actuator/health |

---

## Project Structure

```
device-monitoring-service/
├── backend/                  # Spring Boot application
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml    # Standalone backend compose (optional)
├── frontend/                 # Next.js application
│   ├── app/
│   └── Dockerfile
├── docker-compose.yml        # Root compose — runs everything
└── README.md
```

---

## Services

| Service    | Technology          | Port |
|------------|---------------------|------|
| `postgres` | PostgreSQL 15 Alpine | 5432 |
| `backend`  | Spring Boot 3 / Java 21 | 8080 |
| `frontend` | Next.js 15 / Node 20 | 3000 |

---

## Stopping the application

```bash
# Stop all services (keeps data)
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

---

## Rebuilding after code changes

If you make changes to the backend or frontend source code, rebuild the affected service:

```bash
# Rebuild everything
docker compose up --build

# Rebuild a specific service only
docker compose up --build backend
docker compose up --build frontend
```

---

## Troubleshooting

### Backend fails to connect to the database on startup

The backend may start before PostgreSQL is fully ready. Docker will automatically restart it. Wait 30–60 seconds and check the logs:

```bash
docker compose logs backend
```

If it keeps failing, do a clean restart:

```bash
docker compose down -v
docker compose up --build
```

### Port already in use

If ports 3000, 8080, or 5432 are in use on your machine:

```bash
# Find what's using the port (example for 8080)
lsof -i :8080       # macOS/Linux
netstat -ano | findstr :8080   # Windows
```

Either stop the conflicting process or change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"   # maps host port 8081 to container port 8080
```

### View logs for a specific service

```bash
docker compose logs postgres
docker compose logs backend
docker compose logs frontend

# Follow logs in real time
docker compose logs -f backend
```

### Check running containers

```bash
docker compose ps
```

---

## Environment Variables

All environment variables are configured in the root `docker-compose.yml`. For production deployments, replace the default values:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `device_monitoring` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `password` | Database password |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/device_monitoring` | JDBC connection URL |

---

## Database Migrations

Schema migrations are managed automatically by **Flyway** on backend startup. Migration files are located at:

```
backend/src/main/resources/db/migration/
├── V1__create_device_table.sql
└── V2__create_status_report_table.sql
```

No manual database setup is required.