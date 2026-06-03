# Device Monitoring Service

A container-ready Spring Boot application for monitoring and managing devices, backed by PostgreSQL and managed via Flyway database migrations. It supports real-time updates using WebSockets and includes resilience patterns for production-grade stability.

---

# Tech Stack

- Java 21
- Spring Boot 4
- Spring Data JPA (Hibernate)
- PostgreSQL 15
- Flyway (database migrations)
- Docker & Docker Compose
- WebSockets (real-time updates)
- Resilience4j (fault tolerance: retries, circuit breakers, bulkheads)
- Maven build system

---

#  Project Setup

## 1. Clone the repository

```bash
git clone https://github.com/isaacrabin/device-monitoring-service_BCS.git
cd device-monitoring-service_BCS
---

## 2. Start PostgreSQL using Docker

The application uses PostgreSQL running in Docker.

```bash
docker compose up -d postgres
```

### Verify DB is running:

```bash
docker ps
```

Optional login:

```bash
docker exec -it device-monitoring-postgres psql -U postgres -d device_monitoring
```

---

## 3. Ensure database is ready

You should see:

* Database: `device_monitoring`
* User: `postgres`
* Password: `password`

If needed, reset DB:

```bash
docker compose down -v
docker compose up -d postgres
```

---

## 4. Run the Spring Boot application (locally)

Make sure Java 21 is installed.

Run using Maven:

```bash
mvn spring-boot:run
```

---

## 5. Alternative: Run with environment variables

If needed, explicitly set DB connection:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/device_monitoring \
SPRING_DATASOURCE_USERNAME=postgres \
SPRING_DATASOURCE_PASSWORD=password \
mvn spring-boot:run
```

---

## 6. Verify application startup

On successful startup, you should see:

* Flyway migrations running
* Hibernate session factory created
* Tomcat started on port 8080

---

## 7. Test the API

Open browser or Postman:

```
http://localhost:8080/api/devices
```

---

## 8. Database migrations (Flyway)

Migrations are located at:

```
src/main/resources/db/migration
```

They run automatically on startup:

* `V1__create_device_table.sql`
* `V2__create_status_report_table.sql`

---

## 9. Common issues & fixes

### ❌ PostgreSQL not reachable

Fix:

```bash
docker compose up -d postgres
```

---

### Schema validation errors

Fix:

```bash
docker compose down -v
docker compose up -d postgres
mvn clean spring-boot:run
```

---

### Flyway not running

Check logs:

```bash
mvn spring-boot:run | grep Flyway
```

---

## 10. Stop services

Stop Spring Boot:

```
CTRL + C
```

Stop PostgreSQL:

```bash
docker compose down
```

---

# Architecture Overview

```
Spring Boot (local)
        ↓
PostgreSQL (Docker container)
        ↓
Flyway (auto migrations)
        ↓
JPA/Hibernate (data layer)
```

---

# Notes

* Database runs in Docker only
* Application runs locally (dev mode)
* No manual schema creation required (Flyway handles everything)
* Ensure Docker is running before starting the app

---

# Future Improvements (optional)

* Add full Dockerized app (app + db together)
* Add CI pipeline (GitHub Actions)
* Add Testcontainers for integration tests
* Add Swagger/OpenAPI docs
