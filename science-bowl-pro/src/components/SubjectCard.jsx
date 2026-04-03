import { getSubjectQuestionCount } from "../lib/questionBank";

export default function SubjectCard({ subject, accuracy, isWeak, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        text-left bg-card border rounded-xl p-4 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5
        ${isWeak ? "border-destructive/40" : "border-border"}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{subject.icon}</span>
        {isWeak && (
          <span className="text-[9px] font-bold bg-destructive/10 text-destructive border border-destructive/30 px-1.5 py-0.5 rounded">
            REVIEW
          </span>
        )}
      </div>
      <div className={`font-bold text-sm mt-2 text-${subject.hue}`}>{subject.id}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-1 bg-secondary inline-block px-1.5 py-0.5 rounded">
        {getSubjectQuestionCount(subject.id)} questions
      </div>
      {accuracy !== null ? (
        <>
          <div className="h-0.5 bg-border rounded-full mt-3">
            <div
              className={`h-full rounded-full bg-${subject.hue} transition-all duration-500`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <div className={`text-xs mt-1.5 text-${subject.hue}`}>{accuracy}% accuracy</div>
        </>
      ) : (
        <div className="text-xs text-muted-foreground mt-2">No data yet</div>
      )}
    </button>
  );
}