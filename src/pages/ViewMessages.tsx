// src/components/ViewMessages.tsx
import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface UserInfo {
  _id: string;
  username: string;
  role: string;
}

interface Hotel {
  name: string;
  location: string;
}

interface Message {
  _id: string;
  user: UserInfo | null;
  hotel: Hotel | null;
  message: string;
  reply?: string;
  createdAt: string;
}

const ViewMessages = () => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    if (!token || !user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const endpoint = user?.role === 'operator' ? '/messages/all' : '/messages/mine';
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages');
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const handleReply = async (id: string) => {
    if (!replyText[id]) {
      setError('Reply text cannot be empty');
      return;
    }

    try {
      await api.post(
        `/messages/${id}/reply`,
        { reply: replyText[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText((prev) => ({ ...prev, [id]: '' }));
      fetchMessages();
      setError(null);
    } catch (err) {
      setError('Failed to send reply');
      console.error('Failed to send reply:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMessages();
    } catch (err) {
      setError('Failed to delete message');
      console.error('Failed to delete message:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2>Messages</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading messages...</p>}
      {messages.length === 0 && <p>No messages found.</p>}

      <div className="message-grid">
        {messages.map((msg) => (
          <div key={msg._id} className="message-card">
            <div className="message-header">
              <strong>{msg.user ? msg.user.username : 'User data not available'}</strong> 
              ({msg.user ? msg.user.role : 'Role not available'}) → <em>{msg.message}</em>
            </div>

            <p>
              <strong>Hotel:</strong> 
              {msg.hotel ? `${msg.hotel.name} - ${msg.hotel.location}` : 'Unknown Hotel'}
            </p>

            {/* Reply 顯示 */}
            <p>
              <strong>Reply:</strong> {msg.reply && msg.reply.trim() !== '' ? msg.reply : 'No reply yet.'}
            </p>

            {user?.role === 'operator' && (
              <div className="reply-container">
                <input
                  value={replyText[msg._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [msg._id]: e.target.value })}
                  placeholder="Write a reply..."
                  className="reply-input"
                />
                <button onClick={() => handleReply(msg._id)} className="reply-button">
                  Send Reply
                </button>
                <button onClick={() => handleDelete(msg._id)} className="delete-button">
                  Delete
                </button>
              </div>
            )}

            <p className="timestamp">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMessages;
