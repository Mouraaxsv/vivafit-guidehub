
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient"; // no topo
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
  const storedUser = localStorage.getItem('vivafit_user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.theme) applyTheme(parsedUser.theme);
    if (parsedUser.fontSize) applyFontSize(parsedUser.fontSize);
    if (parsedUser.highContrast !== undefined) applyHighContrast(parsedUser.highContrast);
  } else {
    applyTheme('system');
  }

  setIsLoading(false);
}, []);

// Aqui começam as funções — fora do useEffect!

const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) throw new Error("Credenciais inválidas");

    const loggedUser: User = {
      id: data.user.id,
      name: data.user.user_metadata.name || '',
      email: data.user.email || '',
      role: data.user.user_metadata.role || 'user',
      theme: 'system',
      fontSize: 'medium',
      highContrast: false,
    };

    setUser(loggedUser);
    localStorage.setItem("vivafit_user", JSON.stringify(loggedUser));
    applyTheme(loggedUser.theme);
    applyFontSize(loggedUser.fontSize);
    applyHighContrast(loggedUser.highContrast);
    toast.success("Login realizado com sucesso!");
  } catch (error) {
    toast.error("Erro no login");
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          physicalInfo,
        },
      },
    });

    if (error || !data.user) throw new Error("Erro ao cadastrar");

    // Agora salvando na tabela 'users'
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        name,
        email,
        role,
        physicalInfo,
        theme: 'system',
        fontSize: 'medium',
        highContrast: false,
      },
    ]);
    // Aqui você adiciona o console.error:
if (insertError) {
  console.error("Erro ao inserir na tabela users:", insertError); // <- ADICIONE AQUI
  throw insertError;
}

    if (insertError) throw insertError;

    const newUser: User = {
      id: data.user.id,
      name,
      email,
      role,
      physicalInfo,
      theme: 'system',
      fontSize: 'medium',
      highContrast: false,
    };

    setUser(newUser);
    localStorage.setItem("vivafit_user", JSON.stringify(newUser));
    applyTheme(newUser.theme);
    applyFontSize(newUser.fontSize);
    applyHighContrast(newUser.highContrast);
    toast.success("Cadastro realizado com sucesso!");
  } catch (error) {
    toast.error("Erro ao registrar usuário");
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
  toast.success('Perfil atualizado com sucesso!');
};

const logout = () => {
  setUser(null);
  localStorage.removeItem('vivafit_user');
  toast.success('Logout realizado com sucesso!');
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
