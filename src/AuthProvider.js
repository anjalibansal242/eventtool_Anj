// src/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import userManager from './oidc-config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const signinRedirectCallback = async () => {
    try {
      await userManager.signinRedirectCallback();
      const user = await userManager.getUser();
      setUser(user);
      setAccessToken(user.access_token);
    } catch (error) {
      console.error(error);
    }
  };
  const signinRedirect = () => userManager.signinRedirect();
  const signoutRedirect = () => userManager.signoutRedirect();

  
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await userManager.getUser();
      if (storedUser) {
        setUser(storedUser);
        setAccessToken(storedUser.access_token);
      }
    };

    loadUser();

    userManager.events.addUserLoaded(user => {
      setUser(user);
      setAccessToken(user.access_token);
    });

    userManager.events.addUserUnloaded(() => {
      setUser(null);
      setAccessToken(null);
    });

    return () => {
      userManager.events.removeUserLoaded();
      userManager.events.removeUserUnloaded();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, signinRedirect, signoutRedirect, signinRedirectCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
