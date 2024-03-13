import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInMemberId, setLoggedInMemberId] = useState(null);

  const login = (memberId) => {
    setLoggedInMemberId(memberId);
  };

  const logout = () => {
    setLoggedInMemberId(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInMemberId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};