/**
 * GraphCanvas.jsx — Reusable SVG graph visualisation.
 *
 * Props:
 *   nodes          – string[]              – list of node labels
 *   edges          – [string, string][]    – list of [source, target] pairs
 *   highlightEdges – [string, string][]    – edges to draw in red (optional)
 *   width          – number (default 400)
 *   height         – number (default 400)
 */
export default function GraphCanvas({
  nodes = [],
  edges = [],
  highlightEdges = [],
  width = 400,
  height = 400,
}) {
  if (nodes.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-400"
        style={{ width, height }}
      >
        No substations yet
      </div>
    );
  }

  // ---- layout: arrange nodes in a circle ----
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 40; // leave margin for labels
  const nodeRadius = nodes.length <= 8 ? 20 : 14;

  const posMap = {};
  nodes.forEach((label, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    posMap[label] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  // Helper: does an edge match a highlight entry (order-insensitive)?
  const isHighlighted = (src, tgt) =>
    highlightEdges.some(
      ([a, b]) => (a === src && b === tgt) || (a === tgt && b === src)
    );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full rounded-lg border border-slate-200 bg-slate-50"
      style={{ maxWidth: width, maxHeight: height }}
    >
      {/* Draw edges first so they sit behind nodes */}
      {edges.map(([src, tgt], i) => {
        const a = posMap[src];
        const b = posMap[tgt];
        if (!a || !b) return null;
        const highlighted = isHighlighted(src, tgt);
        return (
          <line
            key={`e-${i}`}
            x1={a.x} y1={a.y}
            x2={b.x} y2={b.y}
            stroke={highlighted ? "#dc2626" : "#3b82f6"}
            strokeWidth={highlighted ? 3 : 2}
            strokeDasharray={highlighted ? "6 3" : "none"}
          />
        );
      })}

      {/* Draw nodes */}
      {nodes.map((label) => {
        const { x, y } = posMap[label];
        return (
          <g key={`n-${label}`}>
            <circle
              cx={x} cy={y} r={nodeRadius}
              fill="#2563eb"
              stroke="#1e3a5f"
              strokeWidth="2"
            />
            <text
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ffffff"
              fontSize={nodeRadius <= 14 ? 9 : 11}
              fontWeight="600"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
