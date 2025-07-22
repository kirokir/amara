import { useStore } from '../lib/store';

export const useAuth = () => {
  const { session, profile, isInitialized } = useStore();
  
  return {
    session,
    profile,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isLoading: !isInitialized,
  };
};