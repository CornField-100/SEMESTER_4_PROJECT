// src/components/ChatBox.jsx
import { useState } from "react";
import api from "../api/axios";

export default function ChatBox() {
  const [role, setRole] = useState("teacher"); // default role
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        role,
        message,
      });

      const botMsg = { role, text: res.data.reply };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "system", text: "⚠️ Error: " + (err.response?.data?.error || err.message) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow flex flex-col h-[80vh]">
      {/* Role Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Mode:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="teacher">Teacher 👩‍🏫</option>
          <option value="peer">Peer 🤝</option>
        </select>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto border p-4 rounded bg-gray-50">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${
              msg.role === "user"
                ? "text-right"
                : msg.role === "teacher"
                ? "text-blue-700"
                : msg.role === "peer"
                ? "text-green-700"
                : "text-red-500"
            }`}
          >
            <span className="block">
              <strong>
                {msg.role === "user"
                  ? "You"
                  : msg.role === "teacher"
                  ? "Teacher"
                  : msg.role === "peer"
                  ? "Peer"
                  : "System"}
                :
              </strong>{" "}
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500">Thinking...</p>}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
