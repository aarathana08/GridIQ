/**
 * App.jsx — Main application shell with sidebar navigation.
 *
 * State lifted here:
 *   - gridA / gridB      → shared graph data (nodes + edges)
 *   - reports             → latest results from comparison, analysis, simulation
 *   - activePage          → current page key (state-based routing)
 */
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import GridBuilder from "./pages/GridBuilder";
import GraphComparison from "./pages/GraphComparison";
import GraphAnalysis from "./pages/GraphAnalysis";
import FailureSimulation from "./pages/FailureSimulation";
import Reports from "./pages/Reports";

const EMPTY_GRID = { nodes: [], edges: [] };

export default function App() {
  // ── Shared state ─────────────────────────────────────────────
  const [activePage, setActivePage] = useState("dashboard");
  const [gridA, setGridA] = useState({ ...EMPTY_GRID });
  const [gridB, setGridB] = useState({ ...EMPTY_GRID });
  const [reports, setReports] = useState({
    comparison: null,
    analysis: null,
    simulation: null,
  });

  // Report updaters — called by child pages after a successful API call
  const saveComparison = (result) =>
    setReports((prev) => ({ ...prev, comparison: result }));
  const saveAnalysis = (result) =>
    setReports((prev) => ({ ...prev, analysis: result }));
  const saveSimulation = (result) =>
    setReports((prev) => ({ ...prev, simulation: result }));

  // ── Render active page ───────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "builder":
        return (
          <GridBuilder
            gridA={gridA} gridB={gridB}
            setGridA={setGridA} setGridB={setGridB}
          />
        );
      case "comparison":
        return (
          <GraphComparison
            gridA={gridA} gridB={gridB}
            onReport={saveComparison}
          />
        );
      case "analysis":
        return (
          <GraphAnalysis
            gridA={gridA} gridB={gridB}
            onReport={saveAnalysis}
          />
        );
      case "simulation":
        return (
          <FailureSimulation
            gridA={gridA} gridB={gridB}
            onReport={saveSimulation}
          />
        );
      case "reports":
        return <Reports reports={reports} />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (fixed, 220 px wide) */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main content area, offset by sidebar width */}
      <main className="ml-[220px] flex-1 p-6 md:p-8 lg:p-10">
        {renderPage()}
      </main>
    </div>
  );
}
