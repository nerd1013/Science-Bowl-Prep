import { useState } from "react";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SUBJECTS } from "../lib/questionBank";
import SubjectPicker from "../components/SubjectPicker";

export default function Flashcards() {
  const [subject, setSubject] = useState(null);
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [known, setKnown] = useState(new Set());

  const generateCards = async (subj) => {
    setSubject(subj);
    setCards([]);
    setIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setLoading(true);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 10 Science Bowl flashcards for: ${subj}. Cover key facts, formulas, definitions, and laws that commonly appear in DOE Science Bowl competitions.
Return JSON array of objects with "front" (question), "back" (answer), and "topic" (subtopic) fields.`,
      response_json_schema: {
        type: "object",
        properties: {
          cards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
                topic: { type: "string" }
              }
            }
          }
        }
      }
    });

    setCards(result?.cards || []);
    setLoading(false);
  };

  if (!subject) {
    return (
      <SubjectPicker
        title="Flashcards"
        subtitle="AI-generated flashcards covering key Science Bowl topics."
        onPick={generateCards}
      />
    );
  }

  const subj = SUBJECTS.find(s => s.id === subject);
  const card = cards[idx];
  const progress = cards.length ? Math.round(known.size / cards.length * 100) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => { setSubject(null); setCards([]); }}
          className="px-3 py-1.5 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all"
        >
          ← Back
        </button>
        <span className="text-xl">{subj.icon}</span>
        <h1 className={`text-xl font-extrabold text-${subj.hue}`}>{subject} Flashcards</h1>
        <span className="ml-auto text-xs text-muted-foreground">{known.size}/{cards.length} mastered</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
          Generating flashcards…
        </div>
      ) : card ? (
        <>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Card {idx + 1} of {cards.length}</span>
            <span>{progress}% mastered</span>
          </div>
          <div className="h-0.5 bg-border rounded-full mb-5">
            <div className="h-full bg-chart-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div
            onClick={() => setFlipped(!flipped)}
            className={`
              bg-card border rounded-2xl p-10 lg:p-14 text-center cursor-pointer min-h-[200px] flex flex-col justify-center
              transition-all duration-300
              ${flipped ? "border-primary bg-accent" : "border-border"}
            `}
          >
            {flipped ? (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-primary mb-3">Answer</div>
                <div className="font-mono text-sm leading-relaxed text-primary">{card.back}</div>
              </>
            ) : (
              <>
                <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Question — tap to reveal</div>
                <div className="font-mono text-sm leading-relaxed">{card.front}</div>
                <div className="text-[10px] text-muted-foreground mt-3">{card.topic}</div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => {
                const n = new Set(known); n.delete(idx); setKnown(n);
                setFlipped(false); setIdx((idx + 1) % cards.length);
              }}
              className="px-4 py-2 bg-secondary text-destructive border border-destructive/30 rounded-lg text-sm font-semibold hover:bg-red-950/30 transition-all"
            >
              ✗ Still Learning
            </button>
            <button
              onClick={() => {
                const n = new Set(known); n.add(idx); setKnown(n);
                setFlipped(false); setIdx((idx + 1) % cards.length);
              }}
              className="px-4 py-2 bg-secondary text-chart-1 border border-chart-1/30 rounded-lg text-sm font-semibold hover:bg-green-950/30 transition-all"
            >
              ✓ Got It
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => generateCards(subject)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              ↻ New Set
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-destructive">
          Could not generate cards.
          <div className="mt-3">
            <button onClick={() => generateCards(subject)} className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all text-muted-foreground">
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}