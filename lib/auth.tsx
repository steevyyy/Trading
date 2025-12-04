
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { api } from './api';
import { type User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      if (!isLoaded) return;

      if (clerkUser) {
        try {
          let dbUser = await api.getUserByClerkId(clerkUser.id);

          if (!dbUser) {
            dbUser = await api.createUser({
              clerk_id: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              name: clerkUser.fullName || clerkUser.firstName || 'User',
              phone: clerkUser.phoneNumbers[0]?.phoneNumber || undefined
            });
          }

          setUser(dbUser);
          setIsAdmin(clerkUser.publicMetadata?.role === 'admin');
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setIsLoading(false);
    };

    initializeUser();
  }, [clerkUser, isLoaded]);

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
