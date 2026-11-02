/**
 * GraphAnalysis.jsx — Detailed graph analysis for a selected grid.
 *
 * Calls three backend endpoints in parallel:
 *   /api/graph/metrics      → vertex count, edge count, degrees
 *   /api/graph/adjacency    → adjacency matrix
 *   /api/graph/connectivity → connected components
 *
 * Props:
 *   gridA / gridB – { nodes, edges }
 *   onReport      – function(result) to save results for Reports page
 */
import { useState } from "react";
import { getMetrics, getAdjacency, getConnectivity } from "../api";
import GraphCanvas from "../components/GraphCanvas";
import LoadingSpinner from "../components/LoadingSpinner";

export default function GraphAnalysis({ gridA, gridB, onReport }) {
  const [selected, setSelected] = useState("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [adjacency, setAdjacency] = useState(null);
  const [connectivity, setConnectivity] = useState(null);

  const grid = selected === "A" ? gridA : gridB;
  const canAnalyze = grid.nodes.length > 0;

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setMetrics(null);
    setAdjacency(null);
    setConnectivity(null);

    try {
      // Run all three calls in parallel
      const [m, a, c] = await Promise.all([
        getMetrics(grid.nodes, grid.edges),
        getAdjacency(grid.nodes, grid.edges),
        getConnectivity(grid.nodes, grid.edges),
      ]);
      setMetrics(m);
      setAdjacency(a);
      setConnectivity(c);
      if (onReport) onReport({ selected, metrics: m, adjacency: a, connectivity: c });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Graph Analysis</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a grid and run a full analysis. You will get vertex and edge counts,
          the degree of each substation, the adjacency matrix, and connectivity info.
        </p>
      </div>

      {/* Grid selector + button */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Analyze:</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="A">Grid A ({gridA.nodes.length} nodes)</option>
            <option value="B">Grid B ({gridB.nodes.length} nodes)</option>
          </select>
        </div>

        {!canAnalyze && (
          <p className="text-sm text-amber-600">
            ⚠ Grid {selected} is empty. Add substations in Grid Builder first.
          </p>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Run Analysis"}
        </button>
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Running analysis…" />}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {metrics && adjacency && connectivity && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* -- Graph Preview -- */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">
              Grid {selected} Preview
            </h2>
            <GraphCanvas nodes={grid.nodes} edges={grid.edges} width={400} height={320} />
          </div>

          {/* -- Basic Metrics -- */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">Basic Metrics</h2>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{metrics.num_vertices}</p>
                <p className="text-xs text-slate-500">Vertices</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{metrics.num_edges}</p>
                <p className="text-xs text-slate-500">Edges</p>
              </div>
            </div>

            {/* Degree table */}
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Vertex Degrees</h3>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-1 font-medium text-slate-500">Substation</th>
                    <th className="pb-1 font-medium text-slate-500">Degree</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.degrees).map(([node, deg]) => (
                    <tr key={node} className="border-b border-slate-100">
                      <td className="py-1 font-mono text-blue-700">{node}</td>
                      <td className="py-1">{deg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* -- Adjacency Matrix -- */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">Adjacency Matrix</h2>
            <div className="overflow-x-auto">
              <table className="text-xs">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    {adjacency.nodes.map((n) => (
                      <th key={n} className="p-1 font-mono font-semibold text-blue-700">{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adjacency.matrix.map((row, ri) => (
                    <tr key={ri}>
                      <td className="p-1 font-mono font-semibold text-blue-700">
                        {adjacency.nodes[ri]}
                      </td>
                      {row.map((val, ci) => (
                        <td
                          key={ci}
                          className={`p-1 text-center ${
                            val === 1 ? "bg-blue-100 font-bold text-blue-800" : "text-slate-400"
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* -- Connectivity -- */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">Connectivity</h2>
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                  connectivity.is_connected
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    connectivity.is_connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {connectivity.is_connected ? "Connected" : "Disconnected"}
              </span>
              <span className="text-sm text-slate-500">
                {connectivity.num_components} component{connectivity.num_components !== 1 ? "s" : ""}
              </span>
            </div>

            {/* List components */}
            <div className="space-y-2">
              {connectivity.components.map((comp, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-2.5">
                  <span className="mr-2 text-xs font-semibold text-slate-400">
                    Component {i + 1}:
                  </span>
                  <span className="font-mono text-sm text-slate-700">
                    {comp.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

