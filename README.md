- Node 22.13.1
- Desarrollo:
MODE=development
docker compose up --build -d
docker compose down
- Producción:
MODE=production
docker compose up --build -d
docker compose down