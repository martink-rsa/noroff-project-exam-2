import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Profile, RegisterData, ProfileUpdateData } from '../types';
import { apiService } from '../services';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: Profile | null }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        apiService.setAccessToken(token);
        dispatch({ type: 'SET_USER', payload: user });
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.login({ email, password });
      const userData = {
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
        avatar: response.data.avatar,
        banner: response.data.banner,
        venueManager: response.data.venueManager,
        _count: response.data._count,
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.register(data);
      const userData = {
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
        avatar: response.data.avatar,
        banner: response.data.banner,
        venueManager: response.data.venueManager,
        _count: response.data._count,
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!state.user) return;
    
    const response = await apiService.updateProfile(state.user.name, data);
    const updatedUser = response.data;
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}