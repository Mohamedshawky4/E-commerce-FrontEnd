import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api",
});

api.defaults.headers.post["Content-Type"] = "application/json";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${api.defaults.baseURL}/users/refresh-token`, {
          token: refreshToken,
        });

        if (response.data.success) {
          const { token, refreshToken: newRefreshToken } = response.data;

          // Update store and localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
