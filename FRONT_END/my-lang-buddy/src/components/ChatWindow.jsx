// simplified ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatWindow({ mode='teacher', userLang='en' }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const inputRef = useRef();

  async function sendMessage() {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setText('');
    try {
      const { data } = await axios.post('/api/chat', { message: text, mode, userLang });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: 'Error: could not fetch response' }]);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((m,i) => (
          <div key={i} className={m.role==='user' ? 'text-right' : 'text-left'}>
            <div className="inline-block p-2 rounded-lg bg-gray-100">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input ref={inputRef} className="flex-1 p-2" value={text} onChange={e=>setText(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && sendMessage()} />
        <button className="ml-2 p-2 bg-blue-600 text-white rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
