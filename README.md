# Saheli Field Network

Saheli is a digital public good prototype for localized, climate-resilient farming guidance. It combines field health, weather, soil moisture, regenerative recommendations, and crop diagnostics in one farmer-facing workspace.

## Run locally

Open two terminals:

```bash
npm run api
npm run dev
```

Then open `http://127.0.0.1:5173/`.

The API runs at `http://127.0.0.1:8787` and exposes:

- `GET /api/health` - network status
- `GET /api/dashboard` - field, metric, advisory, weather, and data-source payload
- `POST /api/diagnostics` - crop disease diagnostic demo response

The API currently uses deterministic demo data. Replace the route data with authenticated Sentinel-2, SoilGrids, Open-Meteo, and production ML services when deploying.
