import axios from 'axios';

const api = axios.create({
  baseURL: "https://sandbox.devxs.xyz/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Ajout automatique du token dans les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token invalide ou expiré
//       localStorage.removeItem("token");
//     }
//     return Promise.reject(error);
//   }
// );

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et qu'on n'est pas en train de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Essayer de rafraîchir le token
          const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem("token", access);
          
          // Mettre à jour le header d'autorisation
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Renvoyer la requête originale avec le nouveau token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("email");
        localStorage.removeItem("full_name");
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;