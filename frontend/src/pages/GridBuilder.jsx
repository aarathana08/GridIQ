/**
 * GridBuilder.jsx — Build two power grids (Grid A and Grid B) side by side.
 *
 * Props:
 *   gridA / gridB            – { nodes: string[], edges: [string,string][] }
 *   setGridA / setGridB      – state setters lifted from App.jsx
 */
import { useState } from "react";
import GraphCanvas from "../components/GraphCanvas";

// ---- Sample grids for quick testing ----
const SAMPLE_A = {
  nodes: ["S1", "S2", "S3", "S4", "S5"],
  edges: [["S1","S2"],["S2","S3"],["S3","S4"],["S4","S5"],["S5","S1"]],
};
const SAMPLE_B = {
  nodes: ["T1", "T2", "T3", "T4", "T5"],
  edges: [["T1","T2"],["T2","T3"],["T3","T4"],["T4","T5"],["T5","T1"]],
};

// ---- Single-grid editor panel ----
function GridPanel({ title, grid, setGrid, sample }) {
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");

  // Add a substation (node)
  const addNode = () => {
    const name = nodeName.trim();
    if (!name) return;
    if (grid.nodes.includes(name)) return; // no duplicates
    setGrid({ ...grid, nodes: [...grid.nodes, name] });
    setNodeName("");
  };

  // Remove a substation and any edges connected to it
  const removeNode = (n) => {
    setGrid({
      nodes: grid.nodes.filter((x) => x !== n),
      edges: grid.edges.filter(([a, b]) => a !== n && b !== n),
    });
  };

  // Add a power line (edge)
  const addEdge = () => {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    // Prevent duplicate edges
    const exists = grid.edges.some(
      ([a, b]) =>
        (a === edgeFrom && b === edgeTo) || (a === edgeTo && b === edgeFrom)
    );
    if (exists) return;
    setGrid({ ...grid, edges: [...grid.edges, [edgeFrom, edgeTo]] });
    setEdgeFrom("");
    setEdgeTo("");
  };

  // Remove an edge
  const removeEdge = (idx) => {
    setGrid({ ...grid, edges: grid.edges.filter((_, i) => i !== idx) });
  };

  // Load sample grid
  const loadSample = () => setGrid({ ...sample });

  // Clear everything
  const clearGrid = () => setGrid({ nodes: [], edges: [] });

  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1e3a5f]">{title}</h2>
        <div className="flex gap-2">
          <button onClick={loadSample} className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
            Load Sample
          </button>
          <button onClick={clearGrid} className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100">
            Clear
          </button>
        </div>
      </div>

      {/* -- Add substation -- */}
      <label className="mb-1 block text-xs font-medium text-slate-500">Add Substation</label>
      <div className="mb-3 flex gap-2">
        <input
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNode()}
          placeholder="e.g. S1"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button onClick={addNode} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          Add
        </button>
      </div>

      {/* -- Node list -- */}
      {grid.nodes.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {grid.nodes.map((n) => (
            <span key={n} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {n}
              <button onClick={() => removeNode(n)} className="ml-0.5 text-blue-400 hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
      )}

      {/* -- Add power line -- */}
      <label className="mb-1 block text-xs font-medium text-slate-500">Add Power Line</label>
      <div className="mb-3 flex gap-2">
        <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">From…</option>
          {grid.nodes.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">To…</option>
          {grid.nodes.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={addEdge} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          Add
        </button>
      </div>

      {/* -- Edge list -- */}
      {grid.edges.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {grid.edges.map(([a, b], i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {a} — {b}
              <button onClick={() => removeEdge(i)} className="ml-0.5 text-slate-400 hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
      )}

      {/* -- Graph preview -- */}
      <GraphCanvas nodes={grid.nodes} edges={grid.edges} width={360} height={300} />
    </div>
  );
}

// ---- Main export ----
export default function GridBuilder({ gridA, gridB, setGridA, setGridB }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1e3a5f]">Grid Builder</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create two power grids below. Add substations (nodes) and power lines
          (edges), or load the sample grids to get started quickly.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <GridPanel title="Grid A" grid={gridA} setGrid={setGridA} sample={SAMPLE_A} />
        <GridPanel title="Grid B" grid={gridB} setGrid={setGridB} sample={SAMPLE_B} />
      </div>
    </div>
  );
}
