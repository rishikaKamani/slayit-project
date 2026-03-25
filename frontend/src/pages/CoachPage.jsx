import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/client';

const COACH_NAME_KEY = 'slayit_coach_name';
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function CoachPage() {
  const [coachName, setCoachName] = useState(() => localStorage.getItem(COACH_NAME_KEY) || '');
  const [nameInput, setNameInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [habits, setHabits] = useState([]);
  const bottomRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    api.get('/habits').then((res) => setHabits(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (coachName && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        text: `Hey! I'm ${coachName}, your habit coach. I can see your habits and streaks. What's on your mind?`
      }]);
    }
  }, [coachName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveName = () => {
    if (!nameInput.trim()) return;
    const name = nameInput.trim();
    localStorage.setItem(COACH_NAME_KEY, name);
    setCoachName(name);
    setNameInput('');
  };

  const buildContext = () => {
    if (!habits.length) return 'The user has no habits yet.';
    return habits.map((h) => {
      const done = (h.days || []).filter((d) => d.status === 'done').length;
      return `- ${h.name} (${h.category}): ${done}/${h.durationDays} days done, ${h.currentStreak} day streak`;
    }).join('\n');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!GROQ_KEY) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'No API key set. Add VITE_GROQ_API_KEY to your .env file.' }]);
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const systemPrompt = `You are ${coachName}, a motivational habit coach inside the Slayit app. You are direct, encouraging, and a little sarcastic (like the app's tone). Keep responses short — 2-4 sentences max. Here are the user's current habits:\n${buildContext()}`;

      // Build message history for context
      const msgHistory = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text })),
        { role: 'user', content: userMsg }
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + GROQ_KEY
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: msgHistory,
          max_tokens: 200
        })
      });

      const data = await res.json();
      const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'assistant', text: reply || 'No response.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Something went wrong. Check your API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!coachName) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="coach-setup">
          <div className="coach-setup-card glass-card">
            <p className="eyebrow">Meet your coach</p>
            <h1>Name your AI coach</h1>
            <p className="coach-setup-sub">Give your coach a name. They'll know your habits and keep you accountable.</p>
            <div className="coach-name-row">
              <input
                className="coach-name-input"
                placeholder="e.g. Alex, Max, Sage..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                autoFocus
              />
              <button className="primary-btn" onClick={saveName}>Let's go</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      <div className="coach-page">
        <div className="coach-header">
          <div>
            <h1 className="dashboard-title">{coachName}</h1>
            <p className="dashboard-subtitle">Your AI habit coach. Honest. Direct. Occasionally sarcastic.</p>
          </div>
          <button className="ghost-btn" onClick={() => { setCoachName(''); localStorage.removeItem(COACH_NAME_KEY); setMessages([]); chatRef.current = null; }}>
            Rename coach
          </button>
        </div>

        <div className="coach-chat-shell glass-card">
          <div className="coach-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`coach-msg ${msg.role === 'user' ? 'coach-msg-user' : 'coach-msg-ai'}`}>
                {msg.role === 'assistant' && <span className="coach-msg-name">{coachName}</span>}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="coach-msg coach-msg-ai">
                <span className="coach-msg-name">{coachName}</span>
                <p className="coach-typing">Thinking...</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="coach-input-row">
            <textarea
              className="coach-input"
              placeholder="Ask your coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="primary-btn coach-send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
