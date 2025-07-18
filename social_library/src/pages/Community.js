// src/pages/Community.js
import React, { useContext, useEffect } from 'react';
import { SocialContext } from '../components/social/SocialLib';
import GroupManagement from '../components/social/GroupManagement';
import Chat from '../components/social/Chat';
import Navbar from '../components/shared/Navbar';
import SocialLib from '../components/social/SocialLib';
import { useNavigate } from 'react-router-dom';

const CommunityContent = () => {
  const { selectedGroup, setSelectedGroup } = useContext(SocialContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect if user is not logged in
    }
  }, [navigate]);

  const handleLeaveGroup = async (groupId) => {
    // Optionally, call the leave-group API here.
    // After leaving, clear the selected group.
    setSelectedGroup(null);
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.leftPane}>
          <GroupManagement />
        </div>
        <div style={styles.rightPane}>
          {selectedGroup ? (
            <Chat group={selectedGroup} onLeaveGroup={handleLeaveGroup} />
          ) : (
            <div style={styles.placeholder}>
              <h2>Select a group to start chatting</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Community = () => {
  return (
    <SocialLib>
      <CommunityContent />
    </SocialLib>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 60px)', // Adjust according to your Navbar height
  },
  leftPane: {
    width: '30%',
    borderRight: '1px solid #ddd',
    overflowY: 'auto',
  },
  rightPane: {
    width: '70%',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#777',
  },
};

export default Community;



