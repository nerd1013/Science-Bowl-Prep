import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Zap, Layers, BookOpen, BarChart3, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { SUBJECTS, TOTAL_QUESTIONS } from "../lib/questionBank";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/practice", icon: Zap, label: "Practice" },
  { path: "/flashcards", icon: Layers, label: "Flashcards" },
  { path: "/lessons", icon: BookOpen, label: "Lessons" },
  { path: "/stats", icon: BarChart3, label: "Stats" },
  { path: "/multiplayer", icon: Users, label: "Multiplayer" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-full w-56 bg-card border-r border-border flex flex-col py-5 shrink-0
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="px-5 pb-4 border-b border-border">
          <div className="text-lg font-extrabold text-primary tracking-tight">Science Bowl</div>
          <div className="text-[10px] text-muted-foreground font-bold tracking-[2px] uppercase mt-0.5">AI Coach</div>
          <div className="inline-block text-[8px] bg-secondary text-primary border border-border rounded px-1.5 py-0.5 mt-2 tracking-wider font-mono">
            {TOTAL_QUESTIONS} DOE-STYLE Qs
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${isActive
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-3 p-3 bg-secondary rounded-lg text-[10px] text-muted-foreground leading-relaxed">
          Built-in question bank<br />
          {TOTAL_QUESTIONS} questions total<br />
          AI coaching powered
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-primary">Science Bowl AI Coach</span>
          <div className="w-5" />
        </div>
        <div className="animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}