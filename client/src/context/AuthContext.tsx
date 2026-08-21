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
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (data: LoginData) => {
    const response = await loginUser(data);

    setAccessToken(response.accessToken);

    const payload = JSON.parse(
      atob(response.accessToken.split(".")[1])
    );

    setUser({
      id: payload.UserInfo.id,
      username: payload.UserInfo.username,
      role: payload.UserInfo.role,
    });
  };

  const register = async (data: RegisterData) => {
    await registerUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshAccessToken();

        setAccessToken(response.accessToken);

        const payload = JSON.parse(
          atob(response.accessToken.split(".")[1])
        );

        setUser({
          id: payload.UserInfo.id,
          username: payload.UserInfo.username,
          role: payload.UserInfo.role,
        });
      } catch {
        setUser(null);
        setAccessToken(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};