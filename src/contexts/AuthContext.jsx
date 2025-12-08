import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const login = async (authToken) => {
    if (authToken) {
      setToken(authToken);
      
      // Récupérer les informations de l'utilisateur depuis le localStorage
      const email = localStorage.getItem("email");
      const fullName = localStorage.getItem("full_name");
      
      if (email && fullName) {
        setUser({
          email,
          full_name: fullName
        });
      }
    } else {
      logout();
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setUser(null);
      setToken(null);
      // Nettoyer tous les éléments d'authentification du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("email");
      localStorage.removeItem("full_name");
    }
  };

  const fetchUser = async () => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      setUser(null);
      setInitializing(false);
      return;
    }

    try {
      setLoading(true);
      
      // Vérifier si on a déjà les informations utilisateur dans le localStorage
      const email = localStorage.getItem("email");
      const fullName = localStorage.getItem("full_name");
      
      if (email && fullName) {
        setUser({
          email,
          full_name: fullName
        });
        setToken(storedToken);
      } else {
        // Si les informations ne sont pas dans le localStorage, essayer de les récupérer depuis l'API
        // Note: Cette partie est pour plus tard quand l'API sera disponible
        // const response = await api.get("/users/profile/");
        // const userData = response.data;
        // setUser(userData);
        // setToken(storedToken);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      
      // En cas d'erreur, on garde les informations du localStorage
      const email = localStorage.getItem("email");
      const fullName = localStorage.getItem("full_name");
      
      if (email && fullName) {
        setUser({
          email,
          full_name: fullName
        });
        setToken(storedToken);
      } else if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };

  const refreshUser = () => {
    fetchUser();
  };

  // Initialisation au chargement de l'application
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          setToken(storedToken);
          // Vérifier si le token est toujours valide en récupérant les infos user
          await fetchUser();
        } catch (error) {
          console.error("Erreur lors de l'initialisation :", error);
          logout();
        }
      } else {
        setInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      initializing,
      login, 
      logout, 
      refreshUser,
      fetchUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);