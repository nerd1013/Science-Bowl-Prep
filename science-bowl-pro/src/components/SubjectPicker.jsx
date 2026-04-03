import { SUBJECTS } from "../lib/questionBank";
import SubjectCard from "./SubjectCard";

export default function SubjectPicker({ title, subtitle, onPick, stats, showRandom, level, onLevelChange }) {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">{subtitle}</p>
      {onLevelChange && (
        <div className="flex gap-2 mb-6">
          {["HS", "MS"].map(l => (
            <button
              key={l}
              onClick={() => onLevelChange(l)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                level === l ? "border-primary text-primary bg-accent" : "border-border text-muted-foreground bg-secondary hover:border-primary"
              }`}
            >
              {l === "HS" ? "🎓 High School" : "📚 Middle School"}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-xl">
        {SUBJECTS.map(s => {
          const st = stats?.[s.id];
          const accuracy = st?.t > 0 ? Math.round(st.c / st.t * 100) : null;
          return (
            <SubjectCard
              key={s.id}
              subject={s}
              accuracy={accuracy}
              isWeak={false}
              onClick={() => onPick(s.id)}
            />
          );
        })}
      </div>
      {showRandom && (
        <button
          onClick={() => {
            const rand = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
            onPick(rand.id);
          }}
          className="mt-4 px-4 py-2 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all"
        >
          🎲 Random Subject
        </button>
      )}
    </div>
  );
}