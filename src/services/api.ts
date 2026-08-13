import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends/receives httpOnly cookies
});

// --- Silent refresh-on-401 with request queuing ---
let isRefreshing = false;
let queue: Array<() => void> = [];

function onRefreshed() {
  queue.forEach((cb) => cb());
  queue = [];
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig;

    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/signup") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // wait for the in-flight refresh to finish, then retry
        return new Promise((resolve) => {
          queue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        queue = [];
        // refresh token is dead — let the app route to login instead of forcing a browser reload
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
