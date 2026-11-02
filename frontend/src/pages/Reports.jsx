/**
 * Reports.jsx — Aggregated summary of all recent analyses.
 *
 * Props:
 *   reports – { comparison, analysis, simulation }
 *     Each is either null (not yet run) or the result object from the API.
 */

export default function Reports({ reports }) {
  const { comparison, analysis, simulation } = reports;
  const hasAny = comparison || analysis || simulation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            A summary of your most recent analyses. Run Comparison, Analysis, or
            Simulation first — the results will appear here automatically.
          </p>
        </div>
        {hasAny && (
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Print / Export
          </button>
        )}
      </div>

      {/* Nothing yet */}
      {!hasAny && (
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-12 text-center text-slate-400">
          <svg className="mx-auto mb-3 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No reports yet</p>
          <p className="mt-1 text-sm">
            Use Graph Comparison, Analysis, or Failure Simulation first.
            Results will show up here.
          </p>
        </div>
      )}

      {/* ── Comparison Report ── */}
      {comparison && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-[#1e3a5f]">
            📊 Isomorphism Comparison
          </h2>
          <div
            className={`mb-3 rounded-lg px-4 py-2 text-sm font-semibold ${
              comparison.is_isomorphic
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {comparison.is_isomorphic
              ? "✅ The two grids are isomorphic (same structure)."
              : "❌ The two grids are NOT isomorphic."}
          </div>

          {comparison.is_isomorphic && comparison.mapping && (
            <div className="overflow-x-auto">
              <table className="text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-1 pr-8 font-medium text-slate-500">Grid A</th>
                    <th className="pb-1 font-medium text-slate-500">Grid B</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparison.mapping).map(([a, b]) => (
                    <tr key={a} className="border-b border-slate-100">
                      <td className="py-1 pr-8 font-mono text-blue-700">{a}</td>
                      <td className="py-1 font-mono text-blue-700">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Analysis Report ── */}
      {analysis && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-[#1e3a5f]">
            📈 Graph Analysis — Grid {analysis.selected}
          </h2>

          {/* Metrics */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{analysis.metrics.num_vertices}</p>
              <p className="text-xs text-slate-500">Vertices</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{analysis.metrics.num_edges}</p>
              <p className="text-xs text-slate-500">Edges</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{analysis.connectivity.num_components}</p>
              <p className="text-xs text-slate-500">Components</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${analysis.connectivity.is_connected ? "bg-green-50" : "bg-red-50"}`}>
              <p className={`text-xl font-bold ${analysis.connectivity.is_connected ? "text-green-700" : "text-red-700"}`}>
                {analysis.connectivity.is_connected ? "Yes" : "No"}
              </p>
              <p className="text-xs text-slate-500">Connected?</p>
            </div>
          </div>

          {/* Degree table */}
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Vertex Degrees</h3>
          <div className="mb-4 overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-1 pr-6 font-medium text-slate-500">Node</th>
                  <th className="pb-1 font-medium text-slate-500">Degree</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analysis.metrics.degrees).map(([n, d]) => (
                  <tr key={n} className="border-b border-slate-100">
                    <td className="py-1 pr-6 font-mono text-blue-700">{n}</td>
                    <td className="py-1">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adjacency matrix */}
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Adjacency Matrix</h3>
          <div className="mb-4 overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {analysis.adjacency.nodes.map((n) => (
                    <th key={n} className="p-1 font-mono font-semibold text-blue-700">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analysis.adjacency.matrix.map((row, ri) => (
                  <tr key={ri}>
                    <td className="p-1 font-mono font-semibold text-blue-700">
                      {analysis.adjacency.nodes[ri]}
                    </td>
                    {row.map((v, ci) => (
                      <td key={ci} className={`p-1 text-center ${v === 1 ? "bg-blue-100 font-bold text-blue-800" : "text-slate-400"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Components */}
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Connected Components</h3>
          <div className="space-y-1.5">
            {analysis.connectivity.components.map((comp, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-2.5">
                <span className="mr-2 text-xs font-semibold text-slate-400">Component {i + 1}:</span>
                <span className="font-mono text-sm text-slate-700">{comp.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Simulation Report ── */}
      {simulation && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-[#1e3a5f]">
            ⚡ Failure Simulation — Grid {simulation.selected}
          </h2>

          {/* What failed */}
          <div className="mb-3">
            <span className="text-sm font-medium text-slate-600">Failed lines: </span>
            {simulation.failedEdges.map(([a, b], i) => (
              <span key={i} className="mr-2 inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                {a} — {b}
              </span>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-slate-700">{simulation.remaining_nodes.length}</p>
              <p className="text-xs text-slate-500">Remaining Nodes</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-slate-700">{simulation.remaining_edges.length}</p>
              <p className="text-xs text-slate-500">Remaining Edges</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${simulation.is_connected ? "bg-green-50" : "bg-red-50"}`}>
              <p className={`text-xl font-bold ${simulation.is_connected ? "text-green-700" : "text-red-700"}`}>
                {simulation.num_components}
              </p>
              <p className="text-xs text-slate-500">Components</p>
            </div>
          </div>

          <div className={`rounded-lg px-4 py-2 text-sm font-semibold ${simulation.is_connected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {simulation.is_connected
              ? "✅ Grid remains connected after the failure."
              : `❌ Grid split into ${simulation.num_components} disconnected groups.`}
          </div>

          {/* Components */}
          <div className="mt-3 space-y-1.5">
            {simulation.components.map((comp, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-2.5">
                <span className="mr-2 text-xs font-semibold text-slate-400">Component {i + 1}:</span>
                <span className="font-mono text-sm text-slate-700">{comp.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

