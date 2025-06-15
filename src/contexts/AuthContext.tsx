import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    physicalInfo?: UserPhysicalInfo
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  applyTheme: (theme: ThemeType) => void;
  applyFontSize: (size: FontSize) => void;
  applyHighContrast: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
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
  };
  
  // Apply high contrast mode
  const applyHighContrast = (enabled: boolean) => {
    const root = window.document.documentElement;
    
    if (enabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  // Fetch user profile from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching user profile for:', supabaseUser.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email || supabaseUser.email || '',
          role: (data.role as UserRole) || 'user',
          physicalInfo: data.physicalInfo as UserPhysicalInfo,
          theme: (data.theme as ThemeType) || 'system',
          fontSize: (data.fontSize as FontSize) || 'medium',
          highContrast: data.highContrast || false,
        };

        console.log('User profile loaded:', userProfile);

        // Apply user preferences
        applyTheme(userProfile.theme!);
        applyFontSize(userProfile.fontSize!);
        applyHighContrast(userProfile.highContrast!);

        return userProfile;
      } else {
        // If no profile exists, create a basic one from Supabase user
        console.log('No profile found, creating basic user object');
        const basicUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
          email: supabaseUser.email || '',
          role: 'user' as UserRole,
          theme: 'system' as ThemeType,
          fontSize: 'medium' as FontSize,
          highContrast: false,
        };
        
        return basicUser;
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Create basic user from Supabase auth user as fallback
      const basicUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
        email: supabaseUser.email || '',
        role: 'user' as UserRole,
        theme: 'system' as ThemeType,
        fontSize: 'medium' as FontSize,
        highContrast: false,
      };
      
      return basicUser;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid blocking the auth callback
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(session.user);
            console.log('Setting user:', userProfile);
            setUser(userProfile);
            setIsLoading(false);
          }, 0);
        } else {
          console.log('No session, clearing user');
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        setTimeout(async () => {
          const userProfile = await fetchUserProfile(session.user);
          console.log('Initial user set:', userProfile);
          setUser(userProfile);
          setIsLoading(false);
        }, 0);
      } else {
        // Apply default theme if no user
        applyTheme('system');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login error:', error);
        throw new Error("Credenciais inválidas");
      }

      if (!data.session || !data.user) {
        throw new Error("Erro na autenticação");
      }

      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Erro no login");
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
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw new Error("Erro ao cadastrar usuário");
      }

      if (!data.user) {
        throw new Error("Erro ao criar usuário");
      }

      // Create user profile in the users table
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        role,
        physicalInfo: physicalInfo as any,
        theme: 'system',
        fontSize: 'medium',
        highContrast: false,
      });

      if (insertError) {
        console.error("Error inserting user profile:", insertError);
        throw new Error("Erro ao criar perfil do usuário");
      }

      toast.success("Cadastro realizado com sucesso!");
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Erro ao registrar usuário");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updateData: any = {
        ...updates,
        // Don't update id or email
        id: undefined,
        email: undefined,
      };

      // Convert physicalInfo to proper format if present
      if (updates.physicalInfo) {
        updateData.physicalInfo = updates.physicalInfo as any;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        toast.error('Erro ao atualizar perfil');
        return;
      }

      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Apply theme/font changes if they were updated
      if (updates.theme) applyTheme(updates.theme);
      if (updates.fontSize) applyFontSize(updates.fontSize);
      if (updates.highContrast !== undefined) applyHighContrast(updates.highContrast);

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erro ao fazer logout');
        return;
      }
      
      setUser(null);
      setSession(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
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
