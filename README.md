# Admin Dashboard Frontend

## Prerequisites

Before you begin, install the following:

- **Git**
- **Node.js 18+** (includes npm)
- **A running backend server** (see [admin-dashboard README](../admin-dashboard/README.md))

## Installation

### 1. Clone the repository

If you haven't already:

```bash
git clone https://github.com/Student-Algonquin-Mobile-Safety/Admin-dashboard.git
cd admin-dashboard-frontend
```

Or if you already have the repository:

```bash
cd admin-dashboard-frontend
```

### 2. Install dependencies

```bash
npm install
```

## Running the Application

### Development Server

Start the Vite development server:

```bash
npm run dev
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Backend Connection Issues

- Verify the backend server is running on `localhost:4000`
- Check that `VITE_API_BASE_URL` and `VITE_WS_URL` in `.env` match your backend configuration
- Ensure your `.env` file is saved and the dev server has reloaded

### WebSocket Connection Failed

- Confirm the backend WebSocket server is running on the configured port (default: 4001)
- Check browser console for connection errors
