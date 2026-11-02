/**
 * Dashboard.jsx — Landing page with health check and feature cards.
 */
import { useState, useEffect } from "react";
import { checkHealth } from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

const FEATURES = [
  {
    key: "builder",
    title: "Grid Builder",
    desc: "Create and edit power grid graphs by adding substations (nodes) and power lines (edges). Build two grids side by side to compare later.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    ),
  },
  {
    key: "comparison",
    title: "Graph Comparison",
    desc: "Check if two grids are structurally identical (isomorphic). If they match, see exactly which nodes map to each other.",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    ),
  },
  {
    key: "analysis",
    title: "Graph Analysis",
    desc: "Get detailed metrics for a grid — vertex and edge counts, degree of each substation, the adjacency matrix, and connectivity info.",
    color: "bg-violet-50 border-violet-200",
    iconColor: "text-violet-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
    ),
  },
  {
    key: "simulation",
    title: "Failure Simulation",
    desc: "Simulate power line failures and see how the grid breaks apart. Find out which substations get disconnected when lines go down.",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    key: "reports",
    title: "Reports",
    desc: "View a summary of all your recent analyses in one place. Export or print the results for your report.",
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
];

export default function Dashboard({ onNavigate }) {
  const [health, setHealth] = useState(null);   // null = loading
  const [error, setError] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    checkHealth()
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="rounded-xl bg-gradient-to-br from-[#1e3a5f] to-blue-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">GridIQ — Power Grid Analyzer</h1>
        <p className="mt-2 max-w-2xl text-blue-100">
          A graph-theory toolkit for analysing power grid networks. Build grids,
          compare topologies, run connectivity analysis, and simulate failures —
          all powered by a Python backend.
        </p>

        {/* Connection badge */}
        <div className="mt-5">
          {health === null && !error && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-yellow-300" />
              Checking backend…
            </span>
          )}
          {health && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              Backend connected
            </span>
          )}
          {error && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/30 px-3 py-1 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              Backend offline — {error}
            </span>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#1e3a5f]">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, title, desc, color, iconColor, icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-shadow hover:shadow-md ${color}`}
            >
              <svg className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {icon}
              </svg>
              <div>
                <h3 className="font-semibold text-[#1e3a5f]">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
