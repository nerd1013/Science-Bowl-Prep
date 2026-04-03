import { useEffect, useRef } from "react";
import { checkSA } from "../lib/questionBank";
import { Loader2, Lightbulb } from "lucide-react";

export default function QuestionView({
  question, selected, saInput, setSaInput, revealed, explanation,
  timeLeft, showBonus, hint, hintLoading, onAnswer, onReveal, onNext, onShowBonus, onHint
}) {
  const inputRef = useRef(null);
  const q = question;
  const isMC = q.format === "Multiple Choice";
  const answered = selected !== null || revealed;

  useEffect(() => {
    if (!isMC && !answered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMC, answered]);

  // Determine result state
  let resultOk = false, resultClass = "", resultTitle = "";
  if (answered) {
    if (revealed) {
      resultClass = "border-yellow-600/40 bg-yellow-950/30";
      resultTitle = "👁 Answer Revealed";
    } else if (selected === "TIMEOUT") {
      resultClass = "border-yellow-600/40 bg-yellow-950/30";
      resultTitle = "⏰ Time's Up!";
    } else {
      resultOk = isMC ? selected === q.answer : checkSA(selected, q.answer);
      resultClass = resultOk ? "border-chart-1/40 bg-green-950/30" : "border-destructive/40 bg-red-950/30";
      resultTitle = resultOk ? "✓ Correct!" : "✗ Incorrect";
    }
  }

  return (
    <div>
      {/* Tags + timer */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 bg-accent text-primary border border-border rounded">
            {q.format}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 bg-accent text-muted-foreground border border-border rounded">
            {q.topic}
          </span>
          {q.level && (
            <span className="text-xs font-bold px-2.5 py-1 bg-secondary text-muted-foreground border border-border rounded">
              {q.level}{q.set ? ` · Set ${q.set}` : ""}{q.round ? ` · R${q.round}` : ""}
            </span>
          )}
        </div>
        {!answered && isMC && timeLeft > 0 && (
          <div className={`text-3xl font-extrabold font-mono ${timeLeft <= 2 ? "text-destructive animate-pulse" : "text-primary"}`}>
            {timeLeft}s
          </div>
        )}
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4 font-mono text-sm leading-relaxed">
        {q.question}
      </div>

      {/* MC options */}
      {isMC && q.options && Object.entries(q.options).map(([k, v]) => {
        let btnClass = "bg-card border border-border text-foreground hover:border-primary hover:bg-accent";
        if (answered) {
          if (k === q.answer) btnClass = "bg-green-950/40 border-chart-1 text-chart-1";
          else if (k === selected) btnClass = "bg-red-950/40 border-destructive text-destructive";
          else btnClass = "bg-card border-border text-muted-foreground opacity-50";
        }
        return (
          <button
            key={k}
            disabled={answered}
            onClick={() => onAnswer(k)}
            className={`block w-full text-left rounded-lg px-4 py-3 font-mono text-sm mb-2 transition-all ${btnClass} disabled:cursor-default`}
          >
            <b>{k})</b> {v}
          </button>
        );
      })}

      {/* SA input */}
      {!isMC && !answered && (
        <>
          <input
            ref={inputRef}
            value={saInput}
            onChange={e => setSaInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && saInput.trim()) onAnswer(saInput.trim()); }}
            placeholder="Type your answer and press Enter…"
            className="w-full px-4 py-3 bg-card border-2 border-border rounded-lg text-foreground font-mono text-sm outline-none focus:border-primary transition-colors mb-3"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => saInput.trim() && onAnswer(saInput.trim())}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Submit Answer
            </button>
            {onHint && (
              <button
                onClick={onHint}
                disabled={hintLoading || !!hint}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all disabled:opacity-50"
              >
                {hintLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                Hint
              </button>
            )}
            <button
              onClick={onReveal}
              className="px-4 py-2.5 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all"
            >
              Skip / Reveal
            </button>
          </div>
          {hint && (
            <div className="mt-3 flex items-start gap-2 bg-accent border border-border rounded-lg p-3">
              <Lightbulb className="w-4 h-4 text-chart-2 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
          )}
        </>
      )}

      {/* Result */}
      {answered && (
        <>
          <div className={`rounded-xl p-4 mt-4 border ${resultClass}`}>
            <div className={`font-bold text-sm mb-1 ${resultOk ? "text-chart-1" : selected === "TIMEOUT" || revealed ? "text-yellow-400" : "text-destructive"}`}>
              {resultTitle}
            </div>
            <div className="font-mono text-sm font-bold text-chart-1 py-1">
              Correct answer: {isMC ? `${q.answer}) ${q.options?.[q.answer] || ""}` : q.answer}
            </div>
            {explanation ? (
              <div className="text-sm leading-relaxed text-muted-foreground mt-2 whitespace-pre-wrap">{explanation}</div>
            ) : (
              <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI is generating a detailed explanation…
              </div>
            )}
          </div>

          {/* Bonus */}
          {q.bonusQ && (
            <div className="bg-secondary border border-border rounded-xl p-4 mt-4">
              <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Bonus Question</div>
              <div className="font-mono text-sm leading-relaxed mb-2">{q.bonusQ}</div>
              {showBonus ? (
                <div className="font-mono text-sm text-chart-1 mt-2">→ {q.bonusA}</div>
              ) : (
                <button
                  onClick={onShowBonus}
                  className="px-3 py-1.5 bg-card text-muted-foreground border border-border rounded-lg text-xs font-semibold hover:border-primary hover:text-primary transition-all"
                >
                  Show Bonus Answer
                </button>
              )}
            </div>
          )}

          <button
            onClick={onNext}
            className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Next Question →
          </button>
        </>
      )}
    </div>
  );
}