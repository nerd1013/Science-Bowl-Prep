import { useState, useEffect, useRef, useCallback } from "react";
import { SUBJECTS, getQuestion, checkSA, getAvailableSets, getAvailableRounds } from "../lib/questionBank";
import { useQuizStats } from "../hooks/useQuizStats";
import SubjectPicker from "../components/SubjectPicker";
import QuestionView from "../components/QuestionView";
import { getAIQuestion, getSmartExplanation, getHint, getQueueLength } from "../lib/aiQuestions";
import { Loader2, Cpu } from "lucide-react";

export default function Practice() {
  const { stats, recordAnswer } = useQuizStats();
  const [subject, setSubject] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saInput, setSaInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState({ c: 0, t: 0 });
  const [showBonus, setShowBonus] = useState(false);
  const [level, setLevel] = useState("HS");
  const [useAI, setUseAI] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [aiQueue, setAiQueue] = useState(0);
  const [filterSet, setFilterSet] = useState(null);
  const [filterRound, setFilterRound] = useState(null);
  const timerRef = useRef(null);
  const explanationLoadingRef = useRef(false);

  const answered = selected !== null || revealed;

  const availableSets = subject ? getAvailableSets(subject, level) : [];
  const availableRounds = subject ? getAvailableRounds(subject, level, filterSet) : [];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const loadNext = useCallback(async () => {
    clearTimer();
    setSelected(null);
    setSaInput("");
    setRevealed(false);
    setExplanation(null);
    setShowBonus(false);
    setHint(null);
    explanationLoadingRef.current = false;

    if (useAI) {
      setLoadingQ(true);
      const q = await getAIQuestion(subject, level);
      setLoadingQ(false);
      setAiQueue(getQueueLength(subject, level));
      setQuestion(q);
      if (q?.format === "Multiple Choice") setTimeLeft(5);
      else setTimeLeft(0);
    } else {
      const q = getQuestion(subject, level, filterSet, filterRound);
      setQuestion(q);
      if (q?.format === "Multiple Choice") setTimeLeft(5);
      else setTimeLeft(0);
    }
  }, [subject, level, clearTimer, useAI, filterSet, filterRound]);

  // Timer effect
  useEffect(() => {
    if (!question || question.format !== "Multiple Choice" || answered) return;
    if (timeLeft <= 0 && question) {
      if (selected === null && !revealed) handleAnswer("TIMEOUT");
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, question, answered]);

  const fetchExplanation = async (q, choice) => {
    if (explanationLoadingRef.current) return;
    explanationLoadingRef.current = true;
    const isMC = q.format === "Multiple Choice";
    const ok = choice === "TIMEOUT" ? false : isMC ? choice === q.answer : checkSA(choice, q.answer);
    try {
      const result = await getSmartExplanation(q, choice, ok, subject);
      setExplanation(result || "No explanation available.");
    } catch (e) {
      setExplanation("Explanation unavailable.");
    }
  };

  const handleHint = async () => {
    if (hintLoading || hint) return;
    setHintLoading(true);
    try {
      const h = await getHint(question, subject);
      setHint(h);
    } finally {
      setHintLoading(false);
    }
  };

  const handleAnswer = (choice) => {
    if (answered) return;
    clearTimer();
    const isMC = question.format === "Multiple Choice";
    const ok = choice === "TIMEOUT" ? false : isMC ? choice === question.answer : checkSA(choice, question.answer);
    setSelected(choice);
    setScore(prev => ({ c: prev.c + (ok ? 1 : 0), t: prev.t + 1 }));
    recordAnswer(subject, ok, question.topic, question.question, String(choice), question.answer);
    fetchExplanation(question, choice);
  };

  const handleReveal = () => {
    clearTimer();
    setRevealed(true);
    setScore(prev => ({ ...prev, t: prev.t + 1 }));
    recordAnswer(subject, false, question.topic, question.question, "skipped", question.answer);
    fetchExplanation(question, "skipped");
  };

  if (!subject) {
    return (
      <SubjectPicker
        title="Practice Round"
        subtitle="Pick a subject. Multiple Choice has a 5-second timer. Short Answer — type your response."
        onPick={setSubject}
        stats={stats}
        showRandom
        level={level}
        onLevelChange={setLevel}
      />
    );
  }

  const subj = SUBJECTS.find(s => s.id === subject);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { clearTimer(); setSubject(null); setQuestion(null); setScore({ c: 0, t: 0 }); setFilterSet(null); setFilterRound(null); }}
            className="px-3 py-1.5 bg-secondary text-muted-foreground border border-border rounded-lg text-sm font-semibold hover:border-primary hover:text-primary transition-all"
          >
            ← Back
          </button>
          <span className="text-xl">{subj.icon}</span>
          <h1 className={`text-xl font-extrabold text-${subj.hue}`}>{subject}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Session: <span className="text-chart-1 font-bold">{score.c}</span>/{score.t}
        </div>
      </div>

      {/* Mode + Set/Round filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setUseAI(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${!useAI ? "border-primary text-primary bg-accent" : "border-border text-muted-foreground bg-secondary hover:border-primary"}`}
        >
          📚 Question Bank
        </button>
        <button
          onClick={() => setUseAI(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${useAI ? "border-primary text-primary bg-accent" : "border-border text-muted-foreground bg-secondary hover:border-primary"}`}
        >
          <Cpu className="w-3 h-3" /> AI Mode
        </button>

        {!useAI && (
          <>
            <div className="h-4 w-px bg-border mx-1" />
            {/* Set picker */}
            <select
              value={filterSet ?? ""}
              onChange={e => { setFilterSet(e.target.value ? Number(e.target.value) : null); setFilterRound(null); setQuestion(null); }}
              className="px-2 py-1.5 rounded-lg text-xs font-bold border border-border bg-secondary text-muted-foreground focus:border-primary outline-none transition-all"
            >
              <option value="">All Sets</option>
              {availableSets.map(s => (
                <option key={s} value={s}>Set {s}</option>
              ))}
            </select>

            {/* Round picker */}
            <select
              value={filterRound ?? ""}
              onChange={e => { setFilterRound(e.target.value ? Number(e.target.value) : null); setQuestion(null); }}
              className="px-2 py-1.5 rounded-lg text-xs font-bold border border-border bg-secondary text-muted-foreground focus:border-primary outline-none transition-all"
            >
              <option value="">All Rounds</option>
              {availableRounds.map(r => (
                <option key={r} value={r}>Round {r}</option>
              ))}
            </select>
          </>
        )}
        {useAI && aiQueue > 0 && (
          <span className="text-[10px] text-muted-foreground font-mono">{aiQueue} queued</span>
        )}
      </div>

      {loadingQ ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">AI is generating a question…</p>
        </div>
      ) : !question ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">{subj.icon}</div>
          <p className="text-sm text-muted-foreground mb-1">Ready to practice {subject}</p>
          {filterSet && <p className="text-xs font-mono text-primary/70 mb-1">Set {filterSet}{filterRound ? ` · Round ${filterRound}` : ""}</p>}
          <p className="text-xs font-mono text-muted-foreground/60 mb-7">MC: 5s timer · SA: type your response</p>
          <button
            onClick={loadNext}
            disabled={loadingQ}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ⚡ Start Question
          </button>
        </div>
      ) : (
        <QuestionView
          question={question}
          selected={selected}
          saInput={saInput}
          setSaInput={setSaInput}
          revealed={revealed}
          explanation={explanation}
          timeLeft={timeLeft}
          showBonus={showBonus}
          hint={hint}
          hintLoading={hintLoading}
          onAnswer={handleAnswer}
          onReveal={handleReveal}
          onNext={loadNext}
          onShowBonus={() => setShowBonus(true)}
          onHint={handleHint}
        />
      )}
    </div>
  );
}