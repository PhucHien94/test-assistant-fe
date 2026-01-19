import axios from "axios";
import { useAuthStore } from "../state/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_PROD_BE_URL || 'http://localhost:3000',
});

// Before send request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  config.headers = config.headers || {};
  if (token) {
    // 1 (config.headers as any).Authorization = 'Bearer ${token}';
    // 2 config.headers.set("Authorization", `Bearer ${token}`);
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// After get response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state
      const authStore = useAuthStore.getState();
      authStore.logout();

      // Redirect to login if not already there
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        // Use replace to avoid adding to history
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
