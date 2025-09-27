import { useState } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("teacher"); // default mode

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/chat", {
        message: input,
        mode,
        userLang: "en",
      });

      const reply = res.data.reply || "⚠️ No response from server.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error talking to backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Header with mode switch */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">My Lang Buddy</h1>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded px-2 py-1 text-sm focus:outline-none"
        >
          <option value="teacher">Teacher Mode</option>
          <option value="friend">Friend Mode</option>
        </select>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 bg-gray-50 rounded p-3 shadow">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              m.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-900 self-start mr-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 italic">Thinking...</div>
        )}
      </div>

      {/* Input area */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Type a message in ${mode} mode...`}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
