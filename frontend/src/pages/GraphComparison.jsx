/**
 * GraphComparison.jsx — Compare Grid A and Grid B for isomorphism.
 *
 * Props:
 *   gridA / gridB – { nodes: string[], edges: [string,string][] }
 *   onReport      – function(result) to save results for the Reports page
 */
import { useState } from "react";
import { checkIsomorphism } from "../api";
import GraphCanvas from "../components/GraphCanvas";
import LoadingSpinner from "../components/LoadingSpinner";

export default function GraphComparison({ gridA, gridB, onReport }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canCompare =
    gridA.nodes.length > 0 && gridB.nodes.length > 0;

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await checkIsomorphism(
        gridA.nodes, gridA.edges,
        gridB.nodes, gridB.edges
      );
      setResult(data);
      if (onReport) onReport(data);
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
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Graph Comparison</h1>
        <p className="mt-1 text-sm text-slate-500">
          Check if Grid A and Grid B have the same structure (are isomorphic).
          If they match, you will see which substation in Grid A maps to which
          substation in Grid B.
        </p>
      </div>

      {/* Grid summaries side by side */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Grid A */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-[#1e3a5f]">Grid A</h2>
          <p className="text-sm text-slate-600">
            {gridA.nodes.length} substations · {gridA.edges.length} power lines
          </p>
          <div className="mt-3">
            <GraphCanvas nodes={gridA.nodes} edges={gridA.edges} width={340} height={260} />
          </div>
        </div>

        {/* Grid B */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-base font-semibold text-[#1e3a5f]">Grid B</h2>
          <p className="text-sm text-slate-600">
            {gridB.nodes.length} substations · {gridB.edges.length} power lines
          </p>
          <div className="mt-3">
            <GraphCanvas nodes={gridB.nodes} edges={gridB.edges} width={340} height={260} />
          </div>
        </div>
      </div>

      {/* Compare button */}
      <div>
        {!canCompare && (
          <p className="mb-2 text-sm text-amber-600">
            ⚠ Both grids must have at least one substation. Go to Grid Builder first.
          </p>
        )}
        <button
          onClick={handleCompare}
          disabled={!canCompare || loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Comparing…" : "Compare Grids"}
        </button>
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner message="Checking isomorphism…" />}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-xl border-2 p-6 shadow-sm ${
            result.is_isomorphic
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              result.is_isomorphic ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.is_isomorphic
              ? "✅ The grids are isomorphic!"
              : "❌ The grids are NOT isomorphic."}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {result.is_isomorphic
              ? "Both grids have the same structure. The mapping below shows how each substation in Grid A corresponds to one in Grid B."
              : "The two grids have different structures. They cannot be mapped onto each other."}
          </p>

          {/* Mapping table */}
          {result.is_isomorphic && result.mapping && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[280px] text-sm">
                <thead>
                  <tr className="border-b border-green-200 text-left">
                    <th className="pb-2 pr-8 font-semibold text-[#1e3a5f]">Grid A Node</th>
                    <th className="pb-2 font-semibold text-[#1e3a5f]">Grid B Node</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.mapping).map(([a, b]) => (
                    <tr key={a} className="border-b border-green-100">
                      <td className="py-1.5 pr-8 font-mono text-blue-700">{a}</td>
                      <td className="py-1.5 font-mono text-blue-700">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

