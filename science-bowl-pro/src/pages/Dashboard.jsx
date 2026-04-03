import { Link } from "react-router-dom";
import { Zap, BookOpen, Layers, Users } from "lucide-react";
import { SUBJECTS } from "../lib/questionBank";
import { TOTAL_QUESTIONS } from "../lib/questionBank";
import { useQuizStats } from "../hooks/useQuizStats";
import SubjectCard from "../components/SubjectCard";

export default function Dashboard() {
  const { stats, totalQ, overall, weak, loading } = useQuizStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
        Welcome back, <span className="text-primary">Scholar</span>
      </h1>
      <p className="text-sm text-muted-foreground mt-1 mb-7">
        Powered by {TOTAL_QUESTIONS} Science Bowl questions + AI coaching
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-primary">{totalQ || "—"}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Questions Answered</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-3xl font-extrabold text-primary">{overall !== null ? `${overall}%` : "—"}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Overall Accuracy</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className={`text-3xl font-extrabold ${weak.length > 0 ? "text-chart-2" : "text-chart-1"}`}>
            {weak.length || "🎉"}
          </div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">Weak Areas</div>
        </div>
      </div>

      {/* Subjects grid */}
      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Subjects</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7">
        {SUBJECTS.map(s => {
          const st = stats[s.id];
          const accuracy = st.t > 0 ? Math.round(st.c / st.t * 100) : null;
          return (
            <Link key={s.id} to="/practice">
              <SubjectCard
                subject={s}
                accuracy={accuracy}
                isWeak={weak.includes(s.id)}
              />
            </Link>
          );
        })}
      </div>

      {/* Quick start */}
      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Quick Start</div>
      <div className="flex flex-wrap gap-3">
        <Link to="/practice" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
          <Zap className="w-4 h-4" /> Practice Round
        </Link>
        <Link to="/lessons" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm border border-border hover:border-primary hover:text-primary transition-all">
          <BookOpen className="w-4 h-4" /> Generate Lesson
        </Link>
        <Link to="/flashcards" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm border border-border hover:border-primary hover:text-primary transition-all">
          <Layers className="w-4 h-4" /> Flashcards
        </Link>
        <Link to="/multiplayer" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm border border-border hover:border-primary hover:text-primary transition-all">
          <Users className="w-4 h-4" /> Multiplayer
        </Link>
      </div>
    </div>
  );
}