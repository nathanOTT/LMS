// src/components/social/SocialLib.js
import React, { createContext, useState } from 'react';

export const SocialContext = createContext();

const SocialLib = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <SocialContext.Provider value={{ groups, setGroups, selectedGroup, setSelectedGroup }}>
      {children}
    </SocialContext.Provider>
  );
};

export default SocialLib;



