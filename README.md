## Requisitos

- Node `22.13.1`

## Desarrollo

- `MODE=development`
- `docker compose up --build -d`
- `docker compose down`

De manera local, Vite correra en `http://localhost:5173/` mientras que API correra en `http://localhost:3000/`

## Producción

- `MODE=production`
- `docker compose up --build -d`
- `docker compose down`

## Database
- `docker exec -it gdlhub-postgres psql -U ${DB_USER} -d ${DB_NAME}`