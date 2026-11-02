const API_BASE = "https://gridiq-2542.onrender.com";
/**
 * api.js — Centralized fetch wrappers for the GridIQ backend.
 * All calls go through the Vite dev-server proxy (/api → localhost:5000).
 */

// ---------- helpers ----------

async function post(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  return res.json();
}

async function get(url) {
  const res = await fetch(`${API_BASE}${url}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Server error ${res.status}: ${text}`);
  }
  return res.json();
}

// ---------- public API ----------

/** Check if the backend is alive. */
export function checkHealth() {
  return get("/api/health");
}

/** Get vertex count, edge count, and degree map. */
export function getMetrics(nodes, edges) {
  return post("/api/graph/metrics", { nodes, edges });
}

/** Check whether two graphs are isomorphic. */
export function checkIsomorphism(g1Nodes, g1Edges, g2Nodes, g2Edges) {
  return post("/api/graph/isomorphism", {
    graph1_nodes: g1Nodes,
    graph1_edges: g1Edges,
    graph2_nodes: g2Nodes,
    graph2_edges: g2Edges,
  });
}

/** Get adjacency matrix for a graph. */
export function getAdjacency(nodes, edges) {
  return post("/api/graph/adjacency", { nodes, edges });
}

/** Get connectivity info (components, etc.). */
export function getConnectivity(nodes, edges) {
  return post("/api/graph/connectivity", { nodes, edges });
}

/** Simulate node/edge failures and get the resulting graph. */
export function simulateFailure(nodes, edges, failedEdges, failedNodes = []) {
  return post("/api/graph/simulate-failure", {
    nodes,
    edges,
    failed_edges: failedEdges,
    failed_nodes: failedNodes,
  });
}
