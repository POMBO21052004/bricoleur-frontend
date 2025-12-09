import axios from 'axios';

const baseURL = "https://sandbox.devxs.xyz/api";

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Liste des routes publiques qui ne nécessitent PAS d'authentification
const PUBLIC_ROUTES = [
  '/manage_users/password-reset/',
  '/manage_users/password-reset-confirm/',
  '/manage_users/set-new-password/',
  '/manage_users/register/',
  '/manage_users/verify-email/',
  '/manage_users/login/',
  '/manage_users/resend_otp/',
  '/manage_users/refresh-token/'
];

// Fonction pour vérifier si une route est publique
const isPublicRoute = (url) => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

// Ajout automatique du token dans les requêtes PRIVÉES uniquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  // Ne pas ajouter le token aux routes publiques
  if (token && !isPublicRoute(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification et rafraîchir le token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et qu'on n'est pas en train de rafraîchir le token
    // ET que ce n'est pas une route publique
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        !isPublicRoute(originalRequest.url)) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          // Essayer de rafraîchir le token
          const response = await axios.post(`${baseURL}/manage_users/refresh-token/`, {
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
        console.error("Refresh token failed:", refreshError);
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("email");
        localStorage.removeItem("full_name");
        
        // Rediriger vers login seulement si on est pas sur une page de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour créer une instance publique (sans intercepteur)
export const createPublicApi = () => {
  return axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export default api;