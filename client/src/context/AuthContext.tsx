import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../services/authService";

import {
  getMyProfile,
} from "../services/userService";

import { setAccessToken as setApiAccessToken } from "../services/api";

import type {
  LoginData,
  RegisterData,
  User,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children, }: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessTokenState] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const saveToken = (token: string) => {
    setAccessTokenState(token);
    setApiAccessToken(token);

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    setUser({
      id: payload.UserInfo.id,
      username: payload.UserInfo.username,
      role: payload.UserInfo.role,
    });
  };

  const login = async (data: LoginData) => {
    const response = await loginUser(data);

    saveToken(response.accessToken);

    const profile = await getMyProfile();

    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            username: profile.username,
            email: profile.email,
            role: profile.role,
            status: profile.status,
            avatar: profile.avatar,
          }
        : currentUser
    );
  };

  const register = async (data: RegisterData) => {
    await registerUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessTokenState(null);
      setApiAccessToken(null);
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((currentUser) =>
      currentUser
        ? {
            ...currentUser,
            ...data,
          }
        : currentUser
    );
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Restore access token
        const response = await refreshAccessToken();

        saveToken(response.accessToken);

        // Get the complete user profile from the database
        const profile = await getMyProfile();

        setUser((currentUser) =>
          currentUser
            ? {
                ...currentUser,
                username: profile.username,
                email: profile.email,
                role: profile.role,
                status: profile.status,
                avatar: profile.avatar,
              }
            : currentUser
        );
      } catch {
        setUser(null);
        setAccessTokenState(null);
        setApiAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};