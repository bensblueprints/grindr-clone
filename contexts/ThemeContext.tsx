import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the theme colors
const lightTheme = {
  primary: '#FE3C72',
  background: '#FFFFFF',
  card: '#F5F5F5',
  cardBackground: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
  tabBarBackground: '#FFFFFF',
  success: '#4CAF50',
};

const darkTheme = {
  primary: '#FE3C72',
  background: '#121212',
  card: '#1E1E1E',
  cardBackground: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  tabBarBackground: '#1A1A1A',
  success: '#4CAF50',
};

// Theme context type
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof darkTheme;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
type ThemeProviderProps = {
  children: ReactNode;
};

// Theme provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 