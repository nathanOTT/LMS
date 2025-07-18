// src/components/social/GroupManagement.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocialContext } from './SocialLib';

const GroupManagement = () => {
  const { groups, setGroups, setSelectedGroup } = useContext(SocialContext);
  const [loading, setLoading] = useState(false);
  const [groupMemberCounts, setGroupMemberCounts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupRules, setNewGroupRules] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      fetchMemberCounts();
    }
  }, [groups]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/social/groups/', {
        headers: { Authorization: `Token ${token}` },
      });
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error.response?.data || error);
    }
    setLoading(false);
  };

  const fetchMemberCounts = async () => {
    const token = localStorage.getItem('token');
    const info = {};
    await Promise.all(
      groups.map(async (group) => {
        try {
          const response = await axios.get(`http://localhost:8000/api/social/groups/${group.id}/members/`, {
            headers: { Authorization: `Token ${token}` },
          });
          const members = response.data;
          const count = members.length;
          const joined = members.some(m => m.user === currentUser.id);
          info[group.id] = { count, joined };
        } catch (error) {
          info[group.id] = { count: 0, joined: false };
        }
      })
    );
    setGroupMemberCounts(info);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      alert('Group name is required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/social/groups/',
        {
          name: newGroupName,
          description: newGroupDescription,
          rules: newGroupRules,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupRules('');
      setModalOpen(false);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error.response?.data || error);
      alert('Failed to create group.');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/social/groups/${groupId}/join/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      // Update membership info for the groups
      fetchMemberCounts();
    } catch (error) {
      console.error("Error joining group:", error.response?.data || error);
      alert("Failed to join group.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with "Groups" and Create Group button */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Groups</h2>
        <button style={styles.createButton} onClick={() => setModalOpen(true)}>
          Create Group
        </button>
      </div>

      {/* Scrollable Group List */}
      <div style={styles.groupList}>
        {loading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <p>No groups available.</p>
        ) : (
          groups.map(group => {
            const info = groupMemberCounts[group.id] || { count: 0, joined: false };
            return (
              <div
                key={group.id}
                style={styles.groupItem}
                onClick={() => {
                  if (info.joined) {
                    setSelectedGroup(group);
                  } else {
                    alert("Please join the group to view its chat.");
                  }
                }}
              >
                <div style={styles.groupItemHeader}>
                  <h4 style={{ margin: '5px 0' }}>{group.name}</h4>
                  <span style={styles.memberCount}>{info.count} members</span>
                </div>
                <p style={styles.groupDescription}>{group.description}</p>
                {!info.joined && (
                  <button
                    style={styles.joinButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinGroup(group.id);
                    }}
                  >
                    Join
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Creating a Group */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Create New Group</h3>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                placeholder="Group Name"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                style={styles.inputField}
              />
              <textarea
                placeholder="Group Description"
                value={newGroupDescription}
                onChange={e => setNewGroupDescription(e.target.value)}
                style={styles.textareaField}
              />
              <textarea
                placeholder="Group Rules"
                value={newGroupRules}
                onChange={e => setNewGroupRules(e.target.value)}
                style={styles.textareaField}
              />
              <div style={styles.modalActions}>
                <button type="submit" style={styles.modalSubmitButton}>
                  Create
                </button>
                <button
                  type="button"
                  style={styles.modalCancelButton}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fbfd',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  createButton: {
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 15px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  groupList: {
    flex: 1,
    overflowY: 'auto',
  },
  groupItem: {
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    position: 'relative',
  },
  groupItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: '0.85rem',
    color: '#888',
  },
  groupDescription: {
    marginTop: '8px',
    fontSize: '0.9rem',
    color: '#555',
  },
  joinButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '8px 12px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textareaField: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  modalSubmitButton: {
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  modalCancelButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default GroupManagement;




