import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000/api";

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let getAccessToken = () => null;
let refreshAccessToken = async () => null;
let onAuthFailure = () => {};

export const configureApiAuth = ({
  getToken,
  onRefresh,
  onUnauthorized,
}) => {
  getAccessToken = getToken;
  refreshAccessToken = onRefresh;
  onAuthFailure = onUnauthorized;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // Retry once after refreshing access token via refresh cookie flow.
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      onAuthFailure();
    }

    return Promise.reject(error);
  }
);

export default api;
