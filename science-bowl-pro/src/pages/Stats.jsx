import { useState } from "react";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SUBJECTS } from "../lib/questionBank";
import { useQuizStats } from "../hooks/useQuizStats";

export default function Stats() {
  const { stats, totalQ, totalC, overall, weak, loading: statsLoading } = useQuizStats();
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const generatePlan = async () => {
    setPlanLoading(true);
    setPlan(null);

    const statsText = SUBJECTS.map(s => {
      const st = stats[s.id];
      const pct = st.t > 0 ? Math.round(st.c / st.t * 100) : 0;
      return `${s.id}: ${st.c}/${st.t} (${pct}%)`;
    }).join(", ");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Science Bowl coach. Based on these stats, write a concise 3-point numbered study plan under 150 words.

Stats: ${statsText}
Weak areas: ${weak.join(", ") || "none"}

Be specific and actionable.`,
    });

    setPlan(result);
    setPlanLoading(false);
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">My Stats</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-7">Track your performance across all subjects.</p>

      <div className="grid grid-cols-2 gap-3 mb-7 max-w-sm">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-primary">{totalQ || 0}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Questions Answered</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-primary">{overall !== null ? `${overall}%` : "—"}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Overall Accuracy</div>
        </div>
      </div>

      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">By Subject</div>
      <div className="max-w-xl mb-7">
        {SUBJECTS.map(s => {
          const st = stats[s.id];
          const pct = st.t > 0 ? Math.round(st.c / st.t * 100) : null;
          const isW = weak.includes(s.id);
          return (
            <div key={s.id} className="flex items-center gap-3 mb-2.5">
              <span className="w-5 text-center">{s.icon}</span>
              <span className={`w-28 text-sm font-semibold ${isW ? "text-chart-2" : ""}`}>{s.id}</span>
              <div className="flex-1 h-1.5 bg-border rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isW ? "bg-chart-2" : `bg-${s.hue}`}`}
                  style={{ width: `${pct || 0}%` }}
                />
              </div>
              <span className={`w-12 text-sm font-mono text-right ${pct === null ? "text-muted-foreground" : isW ? "text-chart-2" : `text-${s.hue}`}`}>
                {pct !== null ? `${pct}%` : "—"}
              </span>
              <span className="w-14 text-xs text-muted-foreground text-right">
                {st.t > 0 ? `${st.c}/${st.t}` : "No data"}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI Study Plan */}
      {!plan && !planLoading && (
        <div>
          <button
            onClick={generatePlan}
            disabled={totalQ === 0}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            🤖 Get AI Study Plan
          </button>
          {totalQ === 0 && (
            <p className="text-xs text-muted-foreground mt-2">Answer some questions to unlock your personalized plan.</p>
          )}
        </div>
      )}

      {planLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your performance…
        </div>
      )}

      {plan && (
        <div className="bg-card border border-border rounded-xl p-5 max-w-xl">
          <div className="text-sm font-bold text-primary mb-2">🤖 Your Personalized Study Plan</div>
          <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{plan}</div>
          <button
            onClick={generatePlan}
            className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            ↻ Refresh Plan
          </button>
        </div>
      )}
    </div>
  );
}