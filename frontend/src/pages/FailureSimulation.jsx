/**
 * FailureSimulation.jsx — Simulate power line failures on a grid.
 *
 * The user picks a grid, selects power lines to "fail", and sees
 * the resulting connectivity breakdown.
 *
 * Props:
 *   gridA / gridB – { nodes, edges }
 *   onReport      – function(result) to save results for Reports page
 */
import { useState } from "react";
import { simulateFailure } from "../api";
import GraphCanvas from "../components/GraphCanvas";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FailureSimulation({ gridA, gridB, onReport }) {
  const [selected, setSelected] = useState("A");
  const [failedSet, setFailedSet] = useState(new Set());   // "src|tgt" keys
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const grid = selected === "A" ? gridA : gridB;
  const canSimulate = grid.edges.length > 0 && failedSet.size > 0;

  // Flip a checkbox for one edge
  const toggleEdge = (src, tgt) => {
    const key = `${src}|${tgt}`;
    setFailedSet((prev) => {
      const copy = new Set(prev);
      if (copy.has(key)) copy.delete(key);
      else copy.add(key);
      return copy;
    });
  };

  // When the user switches grids, clear the selection
  const handleGridChange = (val) => {
    setSelected(val);
    setFailedSet(new Set());
    setResult(null);
    setError(null);
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const failedEdges = [...failedSet].map((k) => k.split("|"));
      const data = await simulateFailure(
        grid.nodes, grid.edges, failedEdges, []
      );
      setResult(data);
      if (onReport) onReport({ selected, failedEdges, ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Highlighted (failed) edges as array for GraphCanvas
  const highlightEdges = [...failedSet].map((k) => k.split("|"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Failure Simulation</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pick a grid, select one or more power lines to fail, and see how the
          grid breaks apart. The original grid is never modified.
        </p>
      </div>

      {/* Grid selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Simulate on:</label>
          <select
            value={selected}
            onChange={(e) => handleGridChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="A">Grid A ({gridA.nodes.length} nodes, {gridA.edges.length} edges)</option>
            <option value="B">Grid B ({gridB.nodes.length} nodes, {gridB.edges.length} edges)</option>
          </select>
        </div>
      </div>

      {grid.edges.length === 0 && (
        <p className="text-sm text-amber-600">
          ⚠ Grid {selected} has no power lines. Go to Grid Builder to add some.
        </p>
      )}

      {grid.edges.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: edge checkboxes + graph preview */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">
                Select Power Lines to Fail
              </h2>
              <p className="mb-3 text-xs text-slate-400">
                Tick the lines you want to remove, then click "Simulate Failure".
              </p>
              <div className="max-h-52 space-y-1.5 overflow-y-auto">
                {grid.edges.map(([src, tgt], i) => {
                  const key = `${src}|${tgt}`;
                  const checked = failedSet.has(key);
                  return (
                    <label
                      key={i}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        checked ? "bg-red-50 text-red-700" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEdge(src, tgt)}
                        className="h-4 w-4 accent-red-600"
                      />
                      <span className="font-mono">
                        {src} — {tgt}
                      </span>
                      {checked && (
                        <span className="ml-auto text-xs font-semibold text-red-500">FAILED</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Simulate button */}
            <button
              onClick={handleSimulate}
              disabled={!canSimulate || loading}
              className="w-full rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Simulating…" : `Simulate Failure (${failedSet.size} line${failedSet.size !== 1 ? "s" : ""})`}
            </button>
          </div>

          {/* Right: graph preview */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-[#1e3a5f]">
              Grid {selected} Preview
            </h2>
            <p className="mb-2 text-xs text-slate-400">
              Red dashed lines = selected for failure
            </p>
            <GraphCanvas
              nodes={grid.nodes}
              edges={grid.edges}
              highlightEdges={highlightEdges}
              width={400}
              height={340}
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner message="Simulating failure…" />}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1e3a5f]">Simulation Results</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">{result.remaining_nodes.length}</p>
              <p className="text-xs text-slate-500">Remaining Substations</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-slate-700">{result.remaining_edges.length}</p>
              <p className="text-xs text-slate-500">Remaining Power Lines</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${result.is_connected ? "bg-green-50" : "bg-red-50"}`}>
              <p className={`text-2xl font-bold ${result.is_connected ? "text-green-700" : "text-red-700"}`}>
                {result.num_components}
              </p>
              <p className="text-xs text-slate-500">Connected Components</p>
            </div>
          </div>

          {/* Connectivity status */}
          <div
            className={`rounded-xl border-2 p-4 ${
              result.is_connected
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <p className={`font-semibold ${result.is_connected ? "text-green-700" : "text-red-700"}`}>
              {result.is_connected
                ? "✅ The grid is still connected after the failure."
                : "❌ The grid is now disconnected!"}
            </p>
            {!result.is_connected && (
              <p className="mt-1 text-sm text-slate-600">
                The network split into {result.num_components} separate groups.
                Some substations can no longer reach each other.
              </p>
            )}
          </div>

          {/* Components list */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Components After Failure</h3>
            {result.components.map((comp, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-2.5">
                <span className="mr-2 text-xs font-semibold text-slate-400">
                  Component {i + 1}:
                </span>
                <span className="font-mono text-sm text-slate-700">{comp.join(", ")}</span>
              </div>
            ))}
          </div>

          {/* Post-failure graph */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-[#1e3a5f]">Grid After Failure</h3>
            <GraphCanvas
              nodes={result.remaining_nodes}
              edges={result.remaining_edges}
              width={400}
              height={320}
            />
          </div>
        </div>
      )}
    </div>
  );
}

