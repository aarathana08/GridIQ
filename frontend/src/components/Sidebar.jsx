/**
 * Sidebar.jsx — Fixed left sidebar for page navigation.
 *
 * Props:
 *   activePage   – string   – current page key
 *   onNavigate   – function – called with the new page key
 */

// Navigation items with simple SVG icon paths
const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    // home icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
      />
    ),
  },
  {
    key: "builder",
    label: "Grid Builder",
    // squares icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    ),
  },
  {
    key: "comparison",
    label: "Comparison",
    // switch-horizontal icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    ),
  },
  {
    key: "analysis",
    label: "Analysis",
    // chart-bar icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4"
      />
    ),
  },
  {
    key: "simulation",
    label: "Simulation",
    // lightning-bolt icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    key: "reports",
    label: "Reports",
    // document-text icon
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col bg-[#1e3a5f] text-white shadow-lg print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        {/* small lightning logo */}
        <svg className="h-7 w-7 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-lg font-bold tracking-wide">GridIQ</span>
      </div>

      {/* Nav links */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2"
              >
                {icon}
              </svg>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
        Power Grid Analyzer
      </div>
    </aside>
  );
}
