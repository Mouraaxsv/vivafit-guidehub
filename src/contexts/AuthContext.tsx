
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'user' | 'professional';
export type UserGoal = 'lose_weight' | 'gain_muscle' | 'improve_health' | 'increase_flexibility';
export type ThemeType = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserPhysicalInfo {
  weight?: number;
  height?: number;
  age?: number;
  goals?: UserGoal[];
  hasMedicalConditions?: boolean;
  medicalConditionsDetails?: string;
  takesMedication?: boolean;
  medicationDetails?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  physicalInfo?: UserPhysicalInfo;
  theme?: ThemeType;
  fontSize?: FontSize;
  highContrast?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    physicalInfo?: UserPhysicalInfo
  ) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  applyTheme: (theme: ThemeType) => void;
  applyFontSize: (size: FontSize) => void;
  applyHighContrast: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    physicalInfo: {
      weight: 75,
      height: 178,
      age: 30,
      goals: ['improve_health', 'gain_muscle'],
      hasMedicalConditions: false,
      takesMedication: false
    },
    theme: 'system',
    fontSize: 'medium'
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'pro@example.com',
    role: 'professional',
    theme: 'light'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme based on user preference or system default
  const applyTheme = (theme: ThemeType) => {
    const root = window.document.documentElement;
    
    // First remove all possible theme classes
    root.classList.remove('light', 'dark');
    
    // Then apply the appropriate theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // If user is logged in, save this preference
    if (user) {
      updateUser({ theme });
    }
  };
  
  // Apply font size based on user preference
  const applyFontSize = (size: FontSize) => {
    const root = window.document.documentElement;
    
    // Remove all possible font size classes
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    // Apply the appropriate font size
    if (size === 'small') {
      root.classList.add('text-sm');
    } else if (size === 'medium') {
      root.classList.add('text-base');
    } else if (size === 'large') {
      root.classList.add('text-lg');
    }
    
    // If user is logged in, save this preference
    if (user) {
      updateUser({ fontSize: size });
    }
  };
  
  // Apply high contrast mode
  const applyHighContrast = (enabled: boolean) => {
    const root = window.document.documentElement;
    
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // If user is logged in, save this preference
    if (user) {
      updateUser({ highContrast: enabled });
    }
  };

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('vivafit_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Apply user preferences on load
      if (parsedUser.theme) {
        applyTheme(parsedUser.theme);
      }
      
      if (parsedUser.fontSize) {
        applyFontSize(parsedUser.fontSize);
      }
      
      if (parsedUser.highContrast !== undefined) {
        applyHighContrast(parsedUser.highContrast);
      }
    } else {
      // Apply system default for non-logged in users
      applyTheme('system');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      setUser(foundUser);
      localStorage.setItem('vivafit_user', JSON.stringify(foundUser));
      
      // Apply user preferences immediately on login
      if (foundUser.theme) {
        applyTheme(foundUser.theme);
      }
      
      if (foundUser.fontSize) {
        applyFontSize(foundUser.fontSize);
      }
      
      if (foundUser.highContrast !== undefined) {
        applyHighContrast(foundUser.highContrast);
      }
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    physicalInfo?: UserPhysicalInfo
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        physicalInfo,
        theme: 'system',
        fontSize: 'medium',
        highContrast: false
      };
      
      // Add to mock database
      MOCK_USERS.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('vivafit_user', JSON.stringify(newUser));
      
      // Apply default preferences for new user
      applyTheme(newUser.theme || 'system');
      applyFontSize(newUser.fontSize || 'medium');
      applyHighContrast(newUser.highContrast || false);
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('vivafit_user', JSON.stringify(updatedUser));
    
    // Update in mock database
    const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    
    toast.success('Profile updated successfully!');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vivafit_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      updateUser,
      applyTheme,
      applyFontSize,
      applyHighContrast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
