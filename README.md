# Power Grid Graph Isomorphism Analyzer ⚡

A full-stack application for analyzing graph isomorphism in power grid networks.

| Layer    | Stack                        |
| -------- | ---------------------------- |
| Frontend | React 19 · Vite · Tailwind 4 |
| Backend  | Python · Flask · NetworkX    |

## Project Structure

```
.
├── backend/
│   ├── app.py              # Flask API entry point
│   ├── requirements.txt    # Python dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Root React component
│   │   ├── index.css       # Tailwind CSS entry
│   │   └── main.jsx        # Vite entry point
│   ├── vite.config.js      # Vite + Tailwind config with API proxy
│   ├── package.json
│   └── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Python** ≥ 3.10

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows  (source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
python app.py                # → http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                  # → http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to the Flask backend, so both servers work together seamlessly during development.

### Verify

Open **http://localhost:5173** — you should see the landing page with a status badge confirming the backend is reachable.

