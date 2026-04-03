import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { checkSA } from "../lib/questionBank";
import { Loader2, Trophy, Crown, ArrowLeft } from "lucide-react";

export default function GameRoom({ room, user, onLeave }) {
  const [currentRoom, setCurrentRoom] = useState(room);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState(null);
  const [saInput, setSaInput] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const questions = currentRoom.questions || [];
  const currentQ = questions[currentRoom.current_question_index];
  const isHost = user?.email === currentRoom.host_email;
  const myPlayer = currentRoom.players?.find(p => p.email === user?.email);
  const isWaiting = currentRoom.status === "waiting";
  const isFinished = currentRoom.status === "finished";
  const isMC = currentQ?.format === "Multiple Choice";

  // Subscribe to room updates
  useEffect(() => {
    const unsub = base44.entities.GameRoom.subscribe((event) => {
      if (event.id === room.id) {
        if (event.type === "update") {
          setCurrentRoom(event.data);
          setSelected(null);
          setSaInput("");
        }
      }
    });
    return () => unsub();
  }, [room.id]);

  // Check if I already answered this question
  const myAnswer = currentRoom.answers?.find(
    a => a.player_email === user?.email && a.question_index === currentRoom.current_question_index
  );
  const alreadyAnswered = !!myAnswer;

  // Timer for current question
  useEffect(() => {
    if (isWaiting || isFinished || !currentQ) return;
    setTimeLeft(currentRoom.question_timer || 8);

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoom.current_question_index, currentRoom.status]);

  useEffect(() => {
    if (!isMC && !alreadyAnswered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentRoom.current_question_index, isMC, alreadyAnswered]);

  const submitAnswer = async (answer) => {
    if (alreadyAnswered || selected) return;
    setSelected(answer);

    const isCorrect = isMC ? answer === currentQ.answer : checkSA(answer, currentQ.answer);
    const timeMs = ((currentRoom.question_timer || 8) - timeLeft) * 1000;

    const newAnswers = [...(currentRoom.answers || []), {
      player_email: user.email,
      question_index: currentRoom.current_question_index,
      answer,
      correct: isCorrect,
      time_ms: timeMs,
    }];

    const updatedPlayers = currentRoom.players.map(p => {
      if (p.email === user.email) {
        return {
          ...p,
          score: (p.score || 0) + (isCorrect ? 10 + Math.max(0, timeLeft) : 0),
          streak: isCorrect ? (p.streak || 0) + 1 : 0,
        };
      }
      return p;
    });

    await base44.entities.GameRoom.update(currentRoom.id, {
      answers: newAnswers,
      players: updatedPlayers,
    });
  };

  const nextQuestion = async () => {
    const nextIdx = currentRoom.current_question_index + 1;
    if (nextIdx >= questions.length) {
      await base44.entities.GameRoom.update(currentRoom.id, {
        status: "finished",
        current_question_index: nextIdx,
      });
    } else {
      await base44.entities.GameRoom.update(currentRoom.id, {
        current_question_index: nextIdx,
      });
    }
  };

  const startGame = async () => {
    await base44.entities.GameRoom.update(currentRoom.id, {
      status: "in_progress",
      current_question_index: 0,
    });
  };

  const sortedPlayers = [...(currentRoom.players || [])].sort((a, b) => (b.score || 0) - (a.score || 0));

  // Waiting lobby
  if (isWaiting) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <button onClick={onLeave} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Lobby
        </button>
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-extrabold mb-1">{currentRoom.name}</h2>
          <p className="text-sm text-muted-foreground mb-5">{currentRoom.subject} · {questions.length} questions</p>

          <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Players ({currentRoom.players?.length || 0})</div>
          <div className="space-y-2 mb-6">
            {currentRoom.players?.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-secondary rounded-lg px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-primary">
                  {(p.name || p.email)[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{p.name || p.email}</span>
                {p.email === currentRoom.host_email && (
                  <Crown className="w-3.5 h-3.5 text-chart-2 ml-1" />
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-secondary rounded-lg text-xs text-muted-foreground mb-5">
            Share this room — other users can join from the Multiplayer lobby.
          </div>

          {isHost ? (
            <button
              onClick={startGame}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              ⚡ Start Game
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">Waiting for host to start the game…</p>
          )}
        </div>
      </div>
    );
  }

  // Finished
  if (isFinished) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <button onClick={onLeave} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Lobby
        </button>
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-chart-2 mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold">Game Over!</h2>
          <p className="text-sm text-muted-foreground mt-1">{currentRoom.name}</p>
        </div>

        <div className="space-y-2">
          {sortedPlayers.map((p, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl p-4 border ${i === 0 ? "bg-accent border-primary" : "bg-card border-border"}`}>
              <span className={`text-lg font-extrabold font-mono w-8 ${i === 0 ? "text-chart-2" : i === 1 ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                #{i + 1}
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold">{p.name || p.email}</div>
              </div>
              <span className="text-lg font-extrabold font-mono text-primary">{p.score || 0}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // In progress
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onLeave} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Leave
        </button>
        <div className="text-xs text-muted-foreground font-mono">
          Q {currentRoom.current_question_index + 1}/{questions.length}
        </div>
        <div className={`text-2xl font-extrabold font-mono ${timeLeft <= 3 ? "text-destructive animate-pulse" : "text-primary"}`}>
          {timeLeft}s
        </div>
      </div>

      {/* Scoreboard mini */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {sortedPlayers.map((p, i) => (
          <div key={i} className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs font-semibold ${p.email === user?.email ? "border-primary bg-accent text-primary" : "border-border bg-secondary text-muted-foreground"}`}>
            {p.name?.split(" ")[0] || p.email.split("@")[0]}: <span className="font-mono">{p.score || 0}</span>
            {p.streak > 1 && <span className="text-chart-2 ml-1">🔥{p.streak}</span>}
          </div>
        ))}
      </div>

      {currentQ ? (
        <>
          <div className="flex gap-2 mb-4">
            <span className="text-xs font-bold px-2.5 py-1 bg-accent text-primary border border-border rounded">{currentQ.format}</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-accent text-muted-foreground border border-border rounded">{currentQ.topic}</span>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 mb-4 font-mono text-sm leading-relaxed">
            {currentQ.question}
          </div>

          {isMC && currentQ.options ? (
            Object.entries(currentQ.options).map(([k, v]) => {
              let btnClass = "bg-card border-border text-foreground hover:border-primary hover:bg-accent";
              if (alreadyAnswered || selected) {
                if (k === currentQ.answer) btnClass = "bg-green-950/40 border-chart-1 text-chart-1";
                else if (k === (selected || myAnswer?.answer)) btnClass = "bg-red-950/40 border-destructive text-destructive";
                else btnClass = "bg-card border-border text-muted-foreground opacity-50";
              }
              return (
                <button
                  key={k}
                  disabled={alreadyAnswered || !!selected}
                  onClick={() => submitAnswer(k)}
                  className={`block w-full text-left rounded-lg px-4 py-3 font-mono text-sm mb-2 border transition-all ${btnClass} disabled:cursor-default`}
                >
                  <b>{k})</b> {v}
                </button>
              );
            })
          ) : !alreadyAnswered && !selected ? (
            <>
              <input
                ref={inputRef}
                value={saInput}
                onChange={e => setSaInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && saInput.trim()) submitAnswer(saInput.trim()); }}
                placeholder="Type your answer…"
                className="w-full px-4 py-3 bg-card border-2 border-border rounded-lg font-mono text-sm outline-none focus:border-primary transition-colors mb-3"
              />
              <button
                onClick={() => saInput.trim() && submitAnswer(saInput.trim())}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </>
          ) : (
            <div className="text-sm text-chart-1 font-mono mt-2">
              Answer: {isMC ? `${currentQ.answer}) ${currentQ.options?.[currentQ.answer]}` : currentQ.answer}
            </div>
          )}

          {isHost && (alreadyAnswered || selected || timeLeft === 0) && (
            <button
              onClick={nextQuestion}
              className="mt-4 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {currentRoom.current_question_index + 1 >= questions.length ? "Finish Game" : "Next Question →"}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          Loading question…
        </div>
      )}
    </div>
  );
}