// File: apps/mobile/lib/store.ts
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface AppState {
  session: Session | null;
  profile: Profile | null;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  fetchProfile: () => Promise<void>;
  initializeSession: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  session: null,
  profile: null,
  isInitialized: false,
  setSession: (session) => {
    set({ session });
    if (session) {
      get().fetchProfile();
    } else {
      set({ profile: null });
    }
  },
  fetchProfile: async () => {
    const session = get().session;
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      set({ profile: data || null });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  initializeSession: async () => {
    // Prevents running initialization multiple times
    if (get().isInitialized) return;

    const { data: { session } } = await supabase.auth.getSession();
    set({ session, isInitialized: true });
    if (session) {
      await get().fetchProfile();
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      get().setSession(session);
    });
  },
}));

// Initialize the session as soon as the store is imported
useStore.getState().initializeSession();