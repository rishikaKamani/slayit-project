# Slayit Backend

Spring Boot backend for the Slayit habit tracker.

## Run

```bash
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

## Main endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/habits`
- `POST /api/habits`
- `POST /api/habits/{habitId}/log`
- `GET /api/dashboard/summary`

Uses in-memory H2 database for quick setup.
