# Algonquin GO — Admin Dashboard

Web dashboard for campus security staff, part of **Algonquin GO**, a campus safety and indoor navigation platform built for Algonquin College. It talks to the [backend API](https://github.com/loudiyaymen/Admin-dashboard) and manages what students see in the [mobile app](https://github.com/loudiyaymen/Mobile-app).

## Features

- **Dashboard:** live system status and Recharts graphs of report and usage trends.
- **Report inbox:** searchable list of incident reports with analytics, detail view, uploaded photos and resolve flow.
- **Send alerts:** pick one or more buildings, send an alert with an auto-generated message, and mark alerts as resolved from the history.
- **Live emergencies:** incoming SOS events arrive over WebSockets.
- **Events:** create and edit events, view registered participants and draw winners.
- **Navigation:** edit building rooms and navigation data used by the mobile app.
- Protected routes with admin login, inline form validation and accessible colours.

## Tech stack

React 19 · Vite · React Router 7 · Recharts · WebSockets · Azure Static Web Apps

## Getting started

Prerequisites: Node.js 18+ and a running [backend](https://github.com/loudiyaymen/Admin-dashboard).

```bash
git clone https://github.com/loudiyaymen/Admin-dashboard-frontend.git
cd Admin-dashboard-frontend
npm install
cp .env.example .env
npm run dev
```

`.env` settings:

| Variable | Default |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:4000/api/v1` |
| `VITE_WS_URL` | `ws://localhost:4001` |

Vite serves the app on `http://localhost:5173` (or the next free port).

## Troubleshooting

### Backend connection issues

- Check that the backend is running on `localhost:4000`.
- Check that `VITE_API_BASE_URL` and `VITE_WS_URL` in `.env` match your backend.
- Restart the dev server after editing `.env`.

### WebSocket connection failed

- Confirm the backend WebSocket server is running on the configured port (default `4001`).
- Check the browser console for connection errors.

## Credits

UI/UX design by the Algonquin College design team (Figma).
