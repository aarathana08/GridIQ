<<<<<<< HEAD
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

=======
# GridIQ – Power Grid Graph Isomorphism Analyzer

**GridIQ** is a web-based application designed to analyze, compare, and visualize power grid networks using graph theory and graph isomorphism concepts. It provides an interactive platform to understand network structures, connectivity, and similarities between different power grid configurations.

## 🚀 Project Overview

GridIQ represents power grid networks as mathematical graphs, where:
- **Nodes (Vertices):** Represent elements within the network.
- **Edges:** Represent connections between network elements.

The application uses graph-based algorithms to analyze network structures and identify similarities between different configurations.

## ✨ Key Features

- **Graph Analysis:** Analyze power grid structures using graph theory.
- **Graph Comparison:** Compare network structures using graph isomorphism concepts.
- **Adjacency Matrix:** Generate and analyze adjacency matrix representations.
- **Connectivity Analysis:** Examine connections between graph nodes.
- **Network Visualization:** Understand graph structures through visual representations.
- **Interactive Interface:** Explore network analysis through a web-based platform.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | Backend framework |
| NetworkX | Graph creation and analysis |
| SciPy | Scientific and matrix operations |
| Flask-CORS | Cross-origin communication |
| Gunicorn | Backend server |
| Antigravity | Development environment |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## 📂 Project Structure

```text
GridIQ/
│
├── app.py
├── graph_engine.py
├── requirements.txt
├── vercel.json
└── README.md
```

## ⚙️ How It Works

1. The user accesses the GridIQ web application.
2. Power grid network data is provided through the interface.
3. The backend processes the network using Python and NetworkX.
4. Graph structures and adjacency matrices are analyzed.
5. The application performs graph-based comparisons and connectivity analysis.
6. The results are presented through the web interface.

## 🌐 Deployment

The project uses separate deployment platforms for its frontend and backend.

- **Frontend:** Vercel
- **Backend:** Render

## 🔗 Live Project

- **Live Website:** https://power-grid-graph-isomorphism.vercel.app/
- **Backend:** https://gridiq-2542.onrender.com

## 🎯 Project Objective

The main objective of GridIQ is to demonstrate how graph theory and graph isomorphism can be applied to power grid network analysis, making network comparison and structural analysis easier through an interactive web application.

## 👩‍💻 Development

Developed using Antigravity with Python-based backend processing and cloud deployment through Vercel and Render.

---

**GridIQ – Connecting Graph Theory with Power Grid Analysis.**
>>>>>>> 26b5556e62fab70dbc8e19aece94cdaf271937dc
