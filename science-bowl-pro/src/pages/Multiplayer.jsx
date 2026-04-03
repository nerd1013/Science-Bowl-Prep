import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { SUBJECTS, getQuestionsBySubject, getAllQuestions } from "../lib/questionBank";
import { Plus, Users, Loader2, RefreshCw } from "lucide-react";
import GameRoom from "../components/GameRoom";

export default function Multiplayer() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("All Subjects");
  const [newCount, setNewCount] = useState(10);

  useEffect(() => {
    loadUser();
    loadRooms();
    const unsub = base44.entities.GameRoom.subscribe((event) => {
      if (event.type === "create") {
        setRooms(prev => [event.data, ...prev]);
      } else if (event.type === "update") {
        setRooms(prev => prev.map(r => r.id === event.id ? event.data : r));
        if (activeRoom?.id === event.id) setActiveRoom(event.data);
      } else if (event.type === "delete") {
        setRooms(prev => prev.filter(r => r.id !== event.id));
      }
    });
    return () => unsub();
  }, []);

  const loadUser = async () => {
    const u = await base44.auth.me();
    setUser(u);
  };

  const loadRooms = async () => {
    const data = await base44.entities.GameRoom.list("-created_date", 20);
    setRooms(data);
    setLoading(false);
  };

  const createRoom = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const questions = newSubject === "All Subjects"
      ? getAllQuestions(newCount)
      : getQuestionsBySubject(newSubject, newCount);

    const room = await base44.entities.GameRoom.create({
      name: newName.trim(),
      host_email: user.email,
      host_name: user.full_name || user.email,
      subject: newSubject,
      status: "waiting",
      players: [{ email: user.email, name: user.full_name || user.email, score: 0, streak: 0 }],
      current_question_index: 0,
      total_questions: questions.length,
      questions,
      answers: [],
      max_players: 8,
      question_timer: 8,
    });
    setActiveRoom(room);
    setShowCreate(false);
    setCreating(false);
  };

  const joinRoom = async (room) => {
    if (!user) return;
    const already = room.players?.some(p => p.email === user.email);
    if (!already && room.status === "waiting") {
      const updated = await base44.entities.GameRoom.update(room.id, {
        players: [...(room.players || []), { email: user.email, name: user.full_name || user.email, score: 0, streak: 0 }]
      });
      setActiveRoom(updated);
    } else {
      setActiveRoom(room);
    }
  };

  if (activeRoom) {
    return <GameRoom room={activeRoom} user={user} onLeave={() => setActiveRoom(null)} />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Multiplayer</h1>
          <p className="text-sm text-muted-foreground mt-1">Compete against friends in real-time Science Bowl matches.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadRooms} className="p-2 bg-secondary border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Create Room
          </button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-card border border-primary/30 rounded-xl p-5 mb-6">
          <div className="text-sm font-bold text-primary mb-4">New Game Room</div>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Room name…"
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors mb-3"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {["All Subjects", ...SUBJECTS.map(s => s.id)].map(s => (
              <button
                key={s}
                onClick={() => setNewSubject(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${newSubject === s ? "border-primary text-primary bg-accent" : "border-border text-muted-foreground bg-secondary hover:border-primary"}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground">Questions:</span>
            {[5, 10, 15, 20].map(n => (
              <button
                key={n}
                onClick={() => setNewCount(n)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold border transition-all ${newCount === n ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={createRoom}
            disabled={!newName.trim() || creating}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {creating ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Creating…</> : "Create & Start"}
          </button>
        </div>
      )}

      {/* Room list */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
          Loading rooms…
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No active rooms. Create one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => joinRoom(room)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{room.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {room.subject} · {room.players?.length || 0} player{(room.players?.length || 0) !== 1 ? "s" : ""} · by {room.host_name}
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                  room.status === "waiting" ? "text-chart-1 border-chart-1/30 bg-green-950/30" :
                  room.status === "in_progress" ? "text-primary border-primary/30 bg-accent" :
                  "text-muted-foreground border-border"
                }`}>
                  {room.status === "waiting" ? "Open" : room.status === "in_progress" ? "Live" : "Finished"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}