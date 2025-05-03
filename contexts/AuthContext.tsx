import React, { createContext, useContext, useState, ReactNode } from 'react';

// User type
type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  gender?: string;
  sexualPreference?: string;
  sexualInterests?: string[];
};

// Auth context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, gender?: string, preference?: string) => Promise<string>;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dummy user data
      const userData: User = {
        id: '123',
        name: 'Test User',
        email: email,
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: 'Male',
        sexualPreference: 'Everyone',
        sexualInterests: ['Dating', 'Hookups', 'Friendship'],
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated signup function
  const signup = async (name: string, email: string, password: string, gender?: string, preference?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a unique ID for the new user
      const userId = 'user_' + Date.now();
      
      // Dummy user data
      const userData: User = {
        id: userId,
        name: name,
        email: email,
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        gender: gender || 'Not specified',
        sexualPreference: preference || 'Not specified',
        sexualInterests: ['Dating', 'Hookups', 'Friendship'],
      };
      
      setUser(userData);
      
      // Return the user ID for use with the bot messaging system
      return userId;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 