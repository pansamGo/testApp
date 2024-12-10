import React, { createContext, useState, useContext } from 'react';

// Define light and dark themes
const lightTheme = {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#6200EE',
};

const darkTheme = {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#BB86FC',
};

// Create context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light theme

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
