import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
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
  initializeSession: () => void;
  setSession: (session: Session | null) => void;
  fetchProfile: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  session: null,
  profile: null,
  isInitialized: false,
  initializeSession: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true });

    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session });
      if (session) get().fetchProfile();
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
      if (session) get().fetchProfile();
      else set({ profile: null });
    });
  },
  setSession: (session) => set({ session }),
  fetchProfile: async () => {
    const session = get().session;
    if (!session?.user) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      set({ profile: data || null });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
}));

useStore.getState().initializeSession();