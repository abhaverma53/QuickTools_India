# QuickTools India

Simple tools for everyday life. A fast, mobile-friendly site with calculators, image tools, PDF tools and generators.

## Features

Current tools:

- **Image Compressor** — reduce JPG, PNG and WebP size in the browser
- **JPG to PDF** — combine images into a downloadable PDF in the browser
- **QR Code Generator** — create QR codes for text, URLs, phone, email and Wi-Fi
- **Age Calculator** — exact age in years, months and days
- **Percentage Calculator** — X% of Y, X is what % of Y, and increase/decrease

The Rails API is lightweight: a health endpoint plus PostgreSQL tables ready for future accounts and usage tracking. There is no authentication or payments in this version.

## Requirements

Docker Desktop or Docker Engine, plus Docker Compose (`docker compose` or `docker-compose`).

## Run locally

From the repository root:

```bash
docker compose up --build
```

If your machine has Compose v1:

```bash
docker-compose up --build
```

### URLs

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:3000

Health:
http://localhost:3000/api/v1/health

PostgreSQL (from the host):
localhost:5432

If ports 3000, 5173 or 5432 are already in use, override them:

```bash
BACKEND_PORT=3001 FRONTEND_PORT=5174 POSTGRES_PORT=5433 VITE_API_URL=http://localhost:3001 docker compose up --build
```
```

PostgreSQL credentials in development:

```text
database: quicktools_development
username: postgres
password: postgres
```

Copy environment examples before running without Docker:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Rails (production) | Render PostgreSQL connection string |
| `POSTGRES_HOST` | Rails (Docker development) | Hostname of Postgres (`postgres` in Compose) |
| `VITE_API_URL` | Frontend build | Rails origin, e.g. `http://localhost:3000` or `https://YOUR-RAILS-RENDER-SERVICE.onrender.com` |
| `VITE_SITE_URL` | Frontend build | Canonical site origin for SEO tags |
| `FRONTEND_URL` | Rails | Allowed CORS origin, e.g. `http://localhost:5173` or `https://quicktoolsindia.com` |
| `SECRET_KEY_BASE` | Rails production | Session/cookie signing secret (`bin/rails secret`) |
| `RAILS_MASTER_KEY` | Rails production (optional) | Only if you decrypt `config/credentials.yml.enc` |
| `RAILS_FORCE_SSL` | Rails production | Set to `false` only for a local production-container test |
| `RAILS_ALLOWED_HOSTS` | Rails production (optional) | Comma-separated hostnames; if unset, host checks are open for Render |

Do not commit `.env`, `backend/config/master.key`, passwords or API keys.

## Deployment

The app is designed to run on Render with Docker.

Expected architecture:

```text
                         Internet
                            │
                            ▼
                  quicktoolsindia.com
                            │
                            ▼
                     React / Nginx
                            │
                            │ API requests
                            ▼
                       Rails API
                            │
                            ▼
                       PostgreSQL
                            │
                            ▼
                          Render
```

### Step-by-step on Render

1. Push this repository to GitHub.
2. In Render, create a Blueprint from the repo (it reads `render.yaml`), or create the three resources by hand: Rails web service, frontend web service, PostgreSQL.
3. Wait until the Rails service URL exists, for example `https://quicktools-india-api.onrender.com`.
4. Set Rails `FRONTEND_URL` to the frontend origin (the `onrender.com` web URL first, later `https://quicktoolsindia.com`).
5. Set the frontend **build-time** variables:
   - `VITE_API_URL=https://YOUR-RAILS-RENDER-SERVICE.onrender.com`
   - `VITE_SITE_URL=https://YOUR-FRONTEND-SERVICE.onrender.com` (later `https://quicktoolsindia.com`)
6. Redeploy the frontend so Vite bakes in the API URL. Vite reads `VITE_*` variables at **build** time, not only at container start.
7. Confirm `https://YOUR-RAILS-RENDER-SERVICE.onrender.com/api/v1/health` returns HTTP 200 and:

```json
{"status":"ok","application":"QuickTools India"}
```

8. On the contact page, use **Check API health** to confirm the browser can call Rails (CORS).

You can leave `RAILS_MASTER_KEY` empty if `SECRET_KEY_BASE` is set (Render Blueprint generates it).

### Domain

Later, point the custom domain **quicktoolsindia.com** (and `www` if you use it) to the Render **frontend** service. Keep `FRONTEND_URL` and `VITE_SITE_URL` updated to `https://quicktoolsindia.com`, then rebuild the frontend and update `frontend/public/sitemap.xml` and `frontend/public/robots.txt` if those still list a different host.

## Adding a tool later

1. Add the tool in `frontend/src/data/tools.js`.
2. Add a route in `frontend/src/App.jsx`.
3. Add the URL to `frontend/public/sitemap.xml`.
4. Implement the page under `frontend/src/pages/`. Prefer browser-side processing for files.

## Production Docker images (optional local check)

```bash
docker build -t quicktools-api ./backend
docker build -t quicktools-web --build-arg VITE_API_URL=http://localhost:3000 ./frontend
```

A full production stack is not defined in `docker-compose.yml`; Compose is the development setup (Vite + Rails + Postgres).

## License

Private project unless you add a license file.
