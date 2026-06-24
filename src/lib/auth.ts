const AUTH_KEY = "ai-job-copilot-auth";
const ACCESS_TOKEN_KEY = "access_token";

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(AUTH_KEY));
}

export function login() {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, "true");
  localStorage.setItem(ACCESS_TOKEN_KEY, "demo-token");
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
