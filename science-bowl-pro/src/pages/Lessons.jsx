import { useState } from "react";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SUBJECTS } from "../lib/questionBank";
import { useQuizStats } from "../hooks/useQuizStats";

export default function Lessons() {
  const { weak } = useQuizStats();
  const [subject, setSubject] = useState("Biology");
  const [goal, setGoal] = useState("");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealedPQs, setRevealedPQs] = useState(new Set());

  const generate = async () => {
    setLoading(true);
    setLesson(null);
    setRevealedPQs(new Set());

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert Science Bowl tutor. Create a comprehensive Science Bowl lesson for: ${subject}.
The student's goal: "${goal || "improve understanding"}"

Return a structured lesson with title, objective, multiple sections with headings, content, and key terms, practice questions, and a study tip.`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          objective: { type: "string" },
          sections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                content: { type: "string" },
                keyTerms: { type: "array", items: { type: "string" } }
              }
            }
          },
          practiceQuestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                q: { type: "string" },
                a: { type: "string" }
              }
            }
          },
          studyTip: { type: "string" }
        }
      }
    });

    setLesson(result);
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">AI Lessons</h1>
      <p className="text-sm text-muted-foreground mt-1 mb-7">
        Personalized lessons tailored to your goals and weak areas.
      </p>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
          Building your personalized lesson…
        </div>
      ) : !lesson ? (
        <div className="max-w-lg">
          <div className="mb-5">
            <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Subject</div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-semibold border transition-all
                    ${subject === s.id ? "border-primary text-primary bg-accent" : "border-border text-muted-foreground bg-secondary hover:border-primary hover:text-primary"}
                  `}
                >
                  {s.icon} {s.id}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">
              Your Goal <span className="text-muted-foreground/40 font-normal">(optional)</span>
            </div>
            <input
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Understand thermodynamics, master stoichiometry…"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          {weak.length > 0 && (
            <div className="p-3 bg-destructive/5 border border-destructive/30 rounded-lg text-sm text-destructive mb-5">
              ⚠ Based on your practice, consider: <strong>{weak.join(", ")}</strong>
            </div>
          )}

          <button
            onClick={generate}
            disabled={!subject}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            📖 Generate Lesson
          </button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-extrabold">{lesson.title}</h2>
              <p className="text-sm text-primary mt-1">{lesson.objective}</p>
            </div>
            <button
              onClick={() => setLesson(null)}
              className="px-3 py-1.5 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all shrink-0"
            >
              New Lesson
            </button>
          </div>

          {lesson.sections?.map((sec, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 mb-3">
              <div className="text-base font-bold text-primary mb-2">{sec.heading}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{sec.content}</p>
              {sec.keyTerms?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sec.keyTerms.map((t, j) => (
                    <span key={j} className="text-xs text-chart-1 bg-secondary border border-border px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {lesson.practiceQuestions?.length > 0 && (
            <div className="bg-card border border-chart-1/30 rounded-xl p-5 mb-3">
              <div className="text-base font-bold text-primary mb-3">Practice Questions</div>
              {lesson.practiceQuestions.map((pq, i) => (
                <div key={i} className="bg-secondary rounded-lg p-3 mb-2">
                  <div className="font-mono text-sm mb-2">{pq.q}</div>
                  {revealedPQs.has(i) ? (
                    <div className="text-sm font-mono text-chart-1">→ {pq.a}</div>
                  ) : (
                    <button
                      onClick={() => setRevealedPQs(prev => new Set(prev).add(i))}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Show Answer
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {lesson.studyTip && (
            <div className="bg-accent border border-border rounded-xl p-4 text-sm text-muted-foreground">
              💡 <strong className="text-primary">Study Tip:</strong> {lesson.studyTip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}