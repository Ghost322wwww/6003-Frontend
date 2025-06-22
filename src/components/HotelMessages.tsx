import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface HotelMessagesProps {
  hotelId: string;
}

interface UserInfo {
  username: string;
  avatarUrl?: string;
  role: string;
}

interface Hotel {
  name: string;
  location: string;
}

interface Message {
  _id: string;
  user: UserInfo;
  hotel: Hotel; // 正確引用 hotel 屬性
  message: string;
  reply?: string;
  createdAt: string;
}

const HotelMessages = ({ hotelId }: HotelMessagesProps) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/hotel/${hotelId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    fetchMessages();
  }, [hotelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(
        '/messages',
        { hotelId, message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      const res = await api.get(`/messages/hotel/${hotelId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h3>Comments</h3>
      {token ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="Write your comment..."
          />
          <button type="submit" style={{ marginTop: '0.5rem' }}>Comment</button>
        </form>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map(msg => (
          <li key={msg._id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
            <p style={{ margin: 0 }}>
              <strong>{msg.user.username}</strong> 
              ({msg.user.role}) → <em>{msg.message}</em>
            </p>

            <p style={{ margin: '0.25rem 0' }}>
              <strong>Hotel:</strong> {msg.hotel.name} - {msg.hotel.location}
            </p>

            {msg.reply && <p style={{ margin: '0.25rem 0', color: '#555' }}><strong>Reply:</strong> {msg.reply}</p>}
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelMessages;
