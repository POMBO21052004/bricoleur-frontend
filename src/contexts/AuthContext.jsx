import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

// Export séparé du hook useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les informations utilisateur via l'API
  const fetchUserFromAPI = async (authToken) => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser l'API pour récupérer les informations utilisateur
      const response = await api.get("/manage_users/auth/profile/");
      
      if (response.data) {
        const userData = {
          ...response.data,
          full_name: `${response.data.first_name} ${response.data.last_name || ''}`.trim()
        };
        
        setUser(userData);
        setToken(authToken);
        
        // Stocker seulement le token dans localStorage
        localStorage.setItem("token", authToken);
        
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
      
      // Gérer les différentes erreurs
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        logout();
      } else if (error.response?.status === 404) {
        setError("Route de profil utilisateur non trouvée.");
      } else {
        setError("Erreur lors du chargement du profil utilisateur.");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (authToken) => {
    if (!authToken) {
      setError("Token d'authentification manquant.");
      return false;
    }

    try {
      // Tenter de récupérer les informations utilisateur avec le token
      const userData = await fetchUserFromAPI(authToken);
      
      if (userData) {
        setToken(authToken);
        setUser(userData);
        setError(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Erreur d'authentification. Veuillez réessayer.");
      return false;
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
      setError(null);
      
      // Nettoyer le localStorage
      localStorage.removeItem("token");
    }
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      return await fetchUserFromAPI(storedToken);
    }
    return null;
  };

  // Vérifier l'état d'authentification au démarrage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          // Vérifier si le token est toujours valide
          await fetchUserFromAPI(storedToken);
        } catch (error) {
          console.error("Erreur lors de l'initialisation :", error);
          logout();
        }
      }
      
      setInitializing(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      initializing,
      error,
      login, 
      logout, 
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

