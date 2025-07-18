// src/components/social/Chat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ group, onLeaveGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!group) return;
    checkMembership();
    fetchMemberCount();
    fetchMessages();
  }, [group, isMember]); // re-run fetchMessages when membership changes

  const fetchMessages = async () => {
    // Only fetch messages if user is a member.
    if (!isMember) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/social/groups/${group.id}/messages/list/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const sortedMessages = response.data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error);
    }
    setLoading(false);
  };

  const fetchMemberCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/social/groups/${group.id}/members/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setMemberCount(response.data.length);
    } catch (error) {
      console.error('Error fetching member count:', error.response?.data || error);
    }
  };

  const checkMembership = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/social/groups/${group.id}/members/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const members = response.data;
      const joined = members.some(m => m.user === currentUser.id);
      setIsMember(joined);
    } catch (error) {
      console.error('Error checking membership:', error.response?.data || error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/social/groups/${group.id}/join/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsMember(true);
      fetchMemberCount();
      fetchMessages();
    } catch (error) {
      console.error("Error joining group:", error.response?.data || error);
      alert("Failed to join group.");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/social/groups/${group.id}/messages/`,
        { text: newMessage },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error);
      alert('Failed to send message.');
    }
  };

  // Compute a light background color based on a string.
  const getUserColor = (str) => {
    if (!str) return '#e0e0e0';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 90%)`;
  };

  // Determine the sender's full name using the membership info.
  const getSenderName = (membership) => {
    const firstName = membership?.user_first_name;
    const lastName = membership?.user_last_name;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return membership?.user_email || 'Unknown';
  };

  // Admin (group creator) cannot leave the group.
  const currentUserIsAdmin = group.created_by === currentUser.id;

  return (
    <div style={styles.chatContainer}>
      {/* Chat Header */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>{group.name}</h2>
          <p style={styles.memberCount}>{memberCount} members</p>
        </div>
        {/* Show Leave button only if user is a member and not admin */}
        {!currentUserIsAdmin && isMember && (
          <button style={styles.leaveButton} onClick={() => onLeaveGroup(group.id)}>
            Leave Group
          </button>
        )}
      </div>

      {/* Message Area */}
      <div style={styles.messagesArea}>
        {!isMember ? (
          <div style={styles.notMemberContainer}>
            <p>You are not a member of this group. Join to view the chat.</p>
            <button style={styles.joinButton} onClick={handleJoinGroup}>Join Group</button>
          </div>
        ) : loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={styles.noMessages}>No messages yet.</p>
        ) : (
          messages.map(msg => {
            const senderName = getSenderName(msg.membership);
            return (
              <div
                key={msg.id}
                style={{
                  ...styles.messageBubble,
                  backgroundColor: getUserColor(msg.membership?.user_email || senderName),
                }}
              >
                <p style={styles.messageText}>{msg.text}</p>
                <div style={styles.senderName}>{senderName}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input (only if user is a member) */}
      {isMember && (
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            style={styles.inputField}
          />
          <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f8fa',
  },
  memberCount: {
    margin: '5px 0 0 0',
    fontSize: '0.9rem',
    color: '#888',
  },
  leaveButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  messagesArea: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    backgroundColor: '#f0f2f5',
  },
  notMemberContainer: {
    textAlign: 'center',
    padding: '20px',
  },
  joinButton: {
    marginTop: '10px',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  noMessages: {
    color: '#666',
    textAlign: 'center',
    marginTop: '20px',
  },
  messageBubble: {
    padding: '10px 15px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  messageText: {
    margin: 0,
    fontSize: '1rem',
    color: '#333',
  },
  senderName: {
    marginTop: '5px',
    fontSize: '0.8rem',
    color: '#555',
    textAlign: 'right',
  },
  inputArea: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #eee',
  },
  inputField: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '1rem',
  },
  sendButton: {
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
};

export default Chat;




