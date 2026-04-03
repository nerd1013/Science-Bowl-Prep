import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { SUBJECTS } from "../lib/questionBank";

export function useQuizStats() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    const data = await base44.entities.QuizSession.list("-created_date", 500);
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const stats = {};
  SUBJECTS.forEach(s => stats[s.id] = { c: 0, t: 0 });
  history.forEach(h => {
    if (stats[h.subject]) {
      stats[h.subject].t++;
      if (h.correct) stats[h.subject].c++;
    }
  });

  const totalQ = history.length;
  const totalC = history.filter(h => h.correct).length;
  const overall = totalQ > 0 ? Math.round(totalC / totalQ * 100) : null;
  const weak = SUBJECTS.filter(s => {
    const st = stats[s.id];
    return st.t >= 2 && Math.round(st.c / st.t * 100) < 60;
  }).map(s => s.id);

  const recordAnswer = async (subject, correct, topic, questionText, userAnswer, correctAnswer) => {
    const record = await base44.entities.QuizSession.create({
      subject, correct, topic,
      question_text: questionText,
      user_answer: userAnswer,
      correct_answer: correctAnswer,
    });
    setHistory(prev => [record, ...prev]);
  };

  return { history, stats, totalQ, totalC, overall, weak, loading, recordAnswer, refetch: fetchHistory };
}