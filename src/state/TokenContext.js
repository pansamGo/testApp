import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Retrieve token on app load
    const getAccessToken = async () => {
      const storedToken = await AsyncStorage.getItem('access_token');
      setToken(storedToken);
    };
    getAccessToken();
  }, []);

  const login = async (newToken) => {
    await AsyncStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    console.log('Token removed successfully!');
    setToken(null);
    console.log('Logging out...');
  };

  return (
    <TokenContext.Provider value={{ token, login, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
