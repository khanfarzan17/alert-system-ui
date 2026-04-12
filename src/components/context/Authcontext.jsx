import React, { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("auth-user")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("auth-token") !== null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth-token");
  });
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth-token", token);
      setIsAuthenticated(true);
      return;
    }

    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    setIsAuthenticated(false);
    setUser(null);
  }, [token]);

  const login = (loginResponse) => {
    const authToken = loginResponse?.token || loginResponse?.accessToken || "";
    const userData =
      loginResponse?.user ??
      (loginResponse?.name || loginResponse?.email
        ? { name: loginResponse.name, email: loginResponse.email }
        : null);
    if (userData) {
      localStorage.setItem("auth-user", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(authToken || "logged-in");
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
